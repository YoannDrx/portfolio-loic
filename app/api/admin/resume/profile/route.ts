import { prisma } from "@/lib/prisma";
import {
  withAuth,
  withAuthAndValidation,
  handleApiError,
  successResponse,
} from "@/lib/api/middleware";
import { resumeProfileSchema } from "@/lib/validations/schemas";
import type { ResumeProfileInput } from "@/lib/validations/schemas";

export const GET = withAuth(async () => {
  try {
    const profile = await prisma.resumeProfile.findFirst();
    return successResponse(profile);
  } catch (error) {
    return handleApiError(error);
  }
});

export const PATCH = withAuthAndValidation(
  resumeProfileSchema,
  async (_req, _context, _user, data: ResumeProfileInput) => {
    try {
      const profile = await prisma.resumeProfile.upsert({
        where: { id: "default_profile" },
        update: data,
        create: { id: "default_profile", ...data },
      });
      return successResponse(profile);
    } catch (error) {
      return handleApiError(error);
    }
  }
);
