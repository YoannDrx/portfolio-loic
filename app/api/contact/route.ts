import { createHmac } from "node:crypto";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactMessageSchema } from "@/lib/validations/schemas";
import { notifyContactMessage } from "@/lib/notifications";
import { apiLogger } from "@/lib/logger";

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>'"]/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ||
      character
  );

export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get("origin");
    if (origin && origin !== new URL(request.url).origin) {
      return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
    }

    const parsed = contactMessageSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid form", fields: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const { website: _honeypot, ...data } = parsed.data;
    await prisma.contactMessage.deleteMany({ where: { expiresAt: { lt: new Date() } } });

    const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const secret =
      process.env.CONTACT_RATE_LIMIT_SECRET ||
      process.env.BETTER_AUTH_SECRET ||
      "local-development";
    const rateLimitKey = createHmac("sha256", secret).update(forwardedFor).digest("hex");
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentMessages = await prisma.contactMessage.count({
      where: { rateLimitKey, createdAt: { gte: oneHourAgo } },
    });
    if (recentMessages >= 5) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 24);
    const contactMessage = await prisma.contactMessage.create({
      data: {
        ...data,
        company: data.company || null,
        projectFormat: data.projectFormat || null,
        deadline: data.deadline || null,
        budget: data.budget || null,
        references: data.references || null,
        subject: data.subject || null,
        rateLimitKey,
        expiresAt,
      },
    });

    await notifyContactMessage(data.name, data.email, data.subject || data.projectType);

    const settings = await prisma.siteSettings.findUnique({
      where: { id: "site_settings" },
      select: { contactEmail: true },
    });
    const resendKey = process.env.RESEND_API_KEY;
    const from = process.env.CONTACT_FROM_EMAIL;

    if (!resendKey || !from) {
      await prisma.contactMessage.update({
        where: { id: contactMessage.id },
        data: { emailStatus: "not_configured" },
      });
    } else {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from,
          to: [settings?.contactEmail || "contact@loic-ghanem.com"],
          reply_to: data.email,
          subject: `[Portfolio] ${data.subject || data.projectType} — ${data.name}`,
          html: `<h1>Nouvelle demande</h1><p><strong>Nom :</strong> ${escapeHtml(data.name)}</p><p><strong>Email :</strong> ${escapeHtml(data.email)}</p><p><strong>Projet :</strong> ${escapeHtml(data.projectType)}</p><p><strong>Format :</strong> ${escapeHtml(data.projectFormat || "Non précisé")}</p><p><strong>Échéance :</strong> ${escapeHtml(data.deadline || "Non précisée")}</p><p><strong>Budget :</strong> ${escapeHtml(data.budget || "Non précisé")}</p><p><strong>Message :</strong></p><p>${escapeHtml(data.message).replace(/\n/g, "<br>")}</p>`,
        }),
      });

      if (response.ok) {
        await prisma.contactMessage.update({
          where: { id: contactMessage.id },
          data: { emailStatus: "sent" },
        });
      } else {
        const error = (await response.text()).slice(0, 500);
        await prisma.contactMessage.update({
          where: { id: contactMessage.id },
          data: { emailStatus: "failed", emailError: error },
        });
        apiLogger.error("Resend contact delivery failed", { status: response.status });
      }
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    apiLogger.error("Contact submission failed", error);
    return NextResponse.json({ error: "Unable to submit message" }, { status: 500 });
  }
}
