import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(testimonials);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching testimonials:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
