import { type NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getCVData, defaultCVTheme } from "@/lib/cv-data";
import type { CVData } from "@/types/cv";

export async function GET() {
  try {
    const data = await getCVData();
    return NextResponse.json(data);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching CV:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = (await req.json()) as CVData;
    const { sections, skills, socialLinks, ...cvData } = body;

    let cv = await prisma.cV.findFirst();

    if (cv) {
      await prisma.cV.update({
        where: { id: cv.id },
        data: {
          fullName: cvData.fullName,
          badgeFr: cvData.badgeFr,
          badgeEn: cvData.badgeEn,
          photo: cvData.photo,
          phone: cvData.phone,
          email: cvData.email,
          website: cvData.website,
          location: cvData.location,
          linkedInUrl: cvData.linkedInUrl,
          headlineFr: cvData.headlineFr,
          headlineEn: cvData.headlineEn,
          bioFr: cvData.bioFr,
          bioEn: cvData.bioEn,
          layout: cvData.layout,
          accentColor: cvData.accentColor || cvData.theme?.primary,
          showPhoto: cvData.showPhoto,
          theme: cvData.theme ?? undefined,
        },
      });
    } else {
      cv = await prisma.cV.create({
        data: {
          fullName: cvData.fullName,
          badgeFr: cvData.badgeFr,
          badgeEn: cvData.badgeEn,
          photo: cvData.photo,
          phone: cvData.phone,
          email: cvData.email,
          website: cvData.website,
          location: cvData.location,
          linkedInUrl: cvData.linkedInUrl,
          headlineFr: cvData.headlineFr,
          headlineEn: cvData.headlineEn,
          bioFr: cvData.bioFr,
          bioEn: cvData.bioEn,
          layout: cvData.layout || "creative",
          accentColor: cvData.accentColor || cvData.theme?.primary || defaultCVTheme.primary,
          showPhoto: cvData.showPhoto ?? true,
          theme: cvData.theme ?? defaultCVTheme,
        },
      });
    }

    await prisma.$transaction(async (tx) => {
      if (cv) {
        if (sections) {
          await tx.cVSection.deleteMany({ where: { cvId: cv.id } });
          for (const section of sections) {
            await tx.cVSection.create({
              data: {
                cvId: cv.id,
                type: section.type,
                placement: section.placement || "main",
                layoutType: section.layoutType || "list",
                color: section.color,
                icon: section.icon,
                order: section.order,
                isActive: section.isActive ?? true,
                translations: {
                  create: section.translations.map((t) => ({
                    locale: t.locale,
                    title: t.title || "",
                  })),
                },
                items: {
                  create: section.items?.map((item) => ({
                    startDate: item.startDate ? new Date(item.startDate) : null,
                    endDate: item.endDate ? new Date(item.endDate) : null,
                    isCurrent: item.isCurrent ?? false,
                    order: item.order,
                    isActive: item.isActive ?? true,
                    translations: {
                      create: item.translations.map((t) => ({
                        locale: t.locale,
                        title: t.title || "",
                        subtitle: t.subtitle,
                        location: t.location,
                        description: t.description,
                      })),
                    },
                  })),
                },
              },
            });
          }
        }

        if (skills) {
          await tx.cVSkill.deleteMany({ where: { cvId: cv.id } });
          for (const skill of skills) {
            await tx.cVSkill.create({
              data: {
                cvId: cv.id,
                category: skill.category,
                level: skill.level,
                showAsBar: skill.showAsBar ?? true,
                order: skill.order,
                isActive: skill.isActive ?? true,
                translations: {
                  create: skill.translations.map((t) => ({
                    locale: t.locale,
                    name: t.name || "",
                  })),
                },
              },
            });
          }
        }

        if (socialLinks) {
          await tx.cVSocialLink.deleteMany({ where: { cvId: cv.id } });
          for (const link of socialLinks) {
            await tx.cVSocialLink.create({
              data: {
                cvId: cv.id,
                platform: link.platform,
                url: link.url,
                label: link.label,
                order: link.order,
              },
            });
          }
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error saving CV:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
