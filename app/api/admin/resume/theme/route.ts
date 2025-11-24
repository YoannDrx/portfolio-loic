import { prisma } from "@/lib/prisma";
import {
  withAuth,
  withAuthAndValidation,
  handleApiError,
  successResponse,
} from "@/lib/api/middleware";
import { resumeThemeSchema } from "@/lib/validations/schemas";
import type { ResumeThemeInput } from "@/lib/validations/schemas";

export const GET = withAuth(async () => {
  try {
    const theme = await prisma.resumeTheme.findFirst();
    return successResponse(theme);
  } catch (error) {
    return handleApiError(error);
  }
});

export const PATCH = withAuthAndValidation(
  resumeThemeSchema,
  async (_req, _context, _user, data: ResumeThemeInput) => {
    try {
      const theme = await prisma.resumeTheme.upsert({
        where: { id: "default_theme" },
        update: data,
        create: { id: "default_theme", ...data },
      });
      return successResponse(theme);
    } catch (error) {
      return handleApiError(error);
    }
  }
);
