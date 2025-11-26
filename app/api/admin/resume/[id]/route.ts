import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  withAuth,
  withAuthAndValidation,
  handleApiError,
  successResponse,
} from "@/lib/api/middleware";
import {
  resumeEntryUpdateSchema,
  type ResumeEntryUpdateInput,
} from "@/lib/validations/schemas";

export const GET = withAuth(async (_req, context, _user) => {
  try {
    const params = await context.params;
    const entry = await prisma.resumeEntry.findUnique({
      where: { id: params.id },
    });

    if (!entry) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return successResponse(entry);
  } catch (error) {
    return handleApiError(error);
  }
});

export const PATCH = withAuthAndValidation(
  resumeEntryUpdateSchema,
  async (_req, context, _user, data: ResumeEntryUpdateInput) => {
    try {
      const params = await context.params;
      const entry = await prisma.resumeEntry.update({
        where: { id: params.id },
        data,
      });
      return successResponse(entry);
    } catch (error) {
      return handleApiError(error);
    }
  }
);

export const DELETE = withAuth(async (_req, context, _user) => {
  try {
    const params = await context.params;
    await prisma.resumeEntry.delete({
      where: { id: params.id },
    });
    return successResponse({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
});
