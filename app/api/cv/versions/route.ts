import { type NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import type { CVData } from "@/types/cv";

type VersionBody = {
  name?: string;
  data?: CVData;
};

export async function GET() {
  const versions = await prisma.cVVersion.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json(versions);
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = (await req.json()) as VersionBody;
  if (!body.data) {
    return new NextResponse("Missing data", { status: 400 });
  }

  const cv = await prisma.cV.findFirst();
  const name = body.name?.trim() || `Version ${new Date().toLocaleString("fr-FR")}`;

  const version = await prisma.cVVersion.create({
    data: {
      cvId: cv?.id,
      name,
      data: body.data,
    },
  });

  return NextResponse.json(version);
}
