import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  withAuth,
  withAuthAndValidation,
  validateQuery,
  handleApiError,
  successResponse,
  createdResponse,
} from "@/lib/api/middleware";
import {
  resumeEntryCreateSchema,
  resumeEntriesQuerySchema,
  ResumeEntryCreateInput,
  ResumeEntriesQueryParams,
} from "@/lib/validations/schemas";

export const GET = withAuth(async (req, context, user) => {
  try {
    const query: ResumeEntriesQueryParams = validateQuery(req, resumeEntriesQuerySchema);
    const where: any = {};

    if (query.type) where.type = query.type;
    if (query.published !== undefined) where.published = query.published;

    const total = await prisma.resumeEntry.count({ where });

    const entries = await prisma.resumeEntry.findMany({
      where,
      orderBy: { [query.sortBy]: query.sortOrder },
      take: query.limit,
      skip: query.page * query.limit,
    });

    return successResponse({
      items: entries,
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
  resumeEntryCreateSchema,
  async (req, context, user, data: ResumeEntryCreateInput) => {
    try {
      const entry = await prisma.resumeEntry.create({
        data: {
          ...data,
          createdById: user.id,
        },
      });
      return createdResponse(entry);
    } catch (error) {
      return handleApiError(error);
    }
  }
);
