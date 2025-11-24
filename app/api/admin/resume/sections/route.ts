import { prisma } from "@/lib/prisma";
import {
  withAuth,
  withAuthAndValidation,
  validateQuery,
  handleApiError,
  successResponse,
  createdResponse,
} from "@/lib/api/middleware";
import { resumeSectionCreateSchema, resumeEntriesQuerySchema } from "@/lib/validations/schemas";
import type { ResumeSectionCreateInput, ResumeEntriesQueryParams } from "@/lib/validations/schemas";

export const GET = withAuth(async (req) => {
  try {
    // Reuse pagination and filtering options if needed in the future
    const query: ResumeEntriesQueryParams = validateQuery(req, resumeEntriesQuerySchema);
    const where: any = {};

    if (query.type) where.type = query.type;
    if (query.published !== undefined) where.published = query.published;

    const total = await prisma.resumeSection.count({ where });
    const sections = await prisma.resumeSection.findMany({
      where,
      orderBy: { [query.sortBy]: query.sortOrder },
      take: query.limit,
      skip: query.page * query.limit,
    });

    return successResponse({
      items: sections,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
});

export const POST = withAuthAndValidation(
  resumeSectionCreateSchema,
  async (_req, _context, _user, data: ResumeSectionCreateInput) => {
    try {
      const section = await prisma.resumeSection.create({
        data: {
          ...data,
          entryIds: data.entryIds ? data.entryIds : undefined,
        },
      });
      return createdResponse(section);
    } catch (error) {
      return handleApiError(error);
    }
  }
);
