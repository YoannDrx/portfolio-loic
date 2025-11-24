import { prisma } from "@/lib/prisma";
import {
  withAuth,
  withAuthAndValidation,
  handleApiError,
  successResponse,
} from "@/lib/api/middleware";
import { resumeSectionUpdateSchema } from "@/lib/validations/schemas";
import type { ResumeSectionUpdateInput } from "@/lib/validations/schemas";

export const GET = withAuth(async (_req, context) => {
  try {
    const params = await context.params;
    const section = await prisma.resumeSection.findUnique({
      where: { id: params.id },
    });
    return successResponse(section);
  } catch (error) {
    return handleApiError(error);
  }
});

export const PATCH = withAuthAndValidation(
  resumeSectionUpdateSchema,
  async (_req, context, _user, data: ResumeSectionUpdateInput) => {
    try {
      const params = await context.params;
      const section = await prisma.resumeSection.update({
        where: { id: params.id },
        data: {
          ...data,
          entryIds: data.entryIds ? data.entryIds : undefined,
        },
      });
      return successResponse(section);
    } catch (error) {
      return handleApiError(error);
    }
  }
);

export const DELETE = withAuth(async (_req, context) => {
  try {
    const params = await context.params;
    await prisma.resumeSection.delete({ where: { id: params.id } });
    return successResponse({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
});
