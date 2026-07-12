import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  withAuth,
  handleApiError,
  successResponse,
  noContentResponse,
  ApiError,
} from "@/lib/api/middleware";

const statusSchema = z.object({ status: z.enum(["new", "in_progress", "replied", "archived"]) });

export const PATCH = withAuth(async (request, context) => {
  try {
    const { id } = await context.params;
    const parsed = statusSchema.safeParse(await request.json());
    if (!parsed.success) throw new ApiError(400, "Statut invalide", "VALIDATION_ERROR");
    const message = await prisma.contactMessage.update({
      where: { id },
      data: {
        status: parsed.data.status,
        processedAt: parsed.data.status === "new" ? null : new Date(),
      },
    });
    return successResponse(message);
  } catch (error) {
    return handleApiError(error);
  }
});

export const DELETE = withAuth(async (_request, context) => {
  try {
    const { id } = await context.params;
    await prisma.contactMessage.delete({ where: { id } });
    return noContentResponse();
  } catch (error) {
    return handleApiError(error);
  }
});
