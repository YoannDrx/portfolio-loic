import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ZodSchema, ZodError } from "zod";

// ============================================
// TYPES
// ============================================

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ============================================
// AUTH MIDDLEWARE
// ============================================

/**
 * Vérifie que la requête est authentifiée et que l'utilisateur est admin
 */
export async function requireAuth(
  req: NextRequest
): Promise<AuthenticatedUser> {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session?.user) {
      throw new ApiError(401, "Unauthorized", "UNAUTHORIZED");
    }

    if (session.user.role !== "admin") {
      throw new ApiError(
        403,
        "Access denied - Admin role required",
        "FORBIDDEN"
      );
    }

    return {
      id: session.user.id,
      email: session.user.email,
      role: session.user.role,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(401, "Invalid session", "INVALID_SESSION");
  }
}

// ============================================
// VALIDATION MIDDLEWARE
// ============================================

/**
 * Valide le body de la requête avec un schema Zod
 */
export async function validateBody<T>(
  req: NextRequest,
  schema: ZodSchema<T>
): Promise<T> {
  try {
    const body = await req.json();
    return schema.parse(body);
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      throw new ApiError(
        400,
        "Validation failed",
        "VALIDATION_ERROR"
      );
    }
    throw new ApiError(400, "Invalid body", "INVALID_BODY");
  }
}

/**
 * Valide les query params avec un schema Zod
 */
export function validateQuery<T>(
  req: NextRequest,
  schema: ZodSchema<T>
): T {
  try {
    const { searchParams } = new URL(req.url);
    const params = Object.fromEntries(searchParams.entries());
    return schema.parse(params);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ApiError(
        400,
        "Invalid query parameters",
        "INVALID_QUERY_PARAMS"
      );
    }
    throw error;
  }
}

// ============================================
// ERROR HANDLING
// ============================================

/**
 * Gère les erreurs et retourne une réponse appropriée
 */
export function handleApiError(error: unknown): NextResponse {
  // Logging en développement
  if (process.env.NODE_ENV === "development") {
    console.error("[API Error]", error);
  }

  // Erreur personnalisée
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    );
  }

  // Erreur de validation Zod
  if (error instanceof ZodError) {
    const formattedErrors = error.errors.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));

    return NextResponse.json(
      {
        error: "Validation failed",
        code: "VALIDATION_ERROR",
        details: formattedErrors,
      },
      { status: 400 }
    );
  }

  // Erreur Prisma (contraintes, etc.)
  if (error && typeof error === "object" && "code" in error) {
    const prismaError = error as { code: string; meta?: Record<string, any> };

    if (prismaError.code === "P2002") {
      return NextResponse.json(
        {
          error: "Resource already exists",
          code: "DUPLICATE_ENTRY",
        },
        { status: 409 }
      );
    }

    if (prismaError.code === "P2025") {
      return NextResponse.json(
        {
          error: "Resource not found",
          code: "NOT_FOUND",
        },
        { status: 404 }
      );
    }
  }

  // Erreur générique (ne pas exposer les détails en production)
  const message =
    process.env.NODE_ENV === "development"
      ? error instanceof Error
        ? error.message
        : "An error occurred"
      : "An error occurred";

  return NextResponse.json(
    {
      error: message,
      code: "INTERNAL_ERROR",
    },
    { status: 500 }
  );
}

// ============================================
// RESPONSE HELPERS
// ============================================

export function successResponse<T>(data: T, status: number = 200): NextResponse {
  return NextResponse.json(data, { status });
}

export function createdResponse<T>(data: T): NextResponse {
  return NextResponse.json(data, { status: 201 });
}

export function noContentResponse(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

// ============================================
// HELPER: Wrapper pour les routes API
// ============================================

type ApiHandler<T = any> = (
  req: NextRequest,
  context: { params: Promise<Record<string, string>> },
  user: AuthenticatedUser
) => Promise<NextResponse<T>>;

/**
 * Wrapper qui gère automatiquement l'auth et les erreurs
 */
export function withAuth<T = any>(handler: ApiHandler<T>) {
  return async (
    req: NextRequest,
    context: { params: Promise<Record<string, string>> }
  ): Promise<NextResponse<T>> => {
    try {
      const user = await requireAuth(req);
      return await handler(req, context, user);
    } catch (error) {
      return handleApiError(error);
    }
  };
}

/**
 * Wrapper qui gère automatiquement l'auth, la validation et les erreurs
 */
export function withAuthAndValidation<TSchema, TResponse = any>(
  schema: ZodSchema<TSchema>,
  handler: (
    req: NextRequest,
    context: { params: Promise<Record<string, string>> },
    user: AuthenticatedUser,
    data: TSchema
  ) => Promise<NextResponse<TResponse>>
) {
  return async (
    req: NextRequest,
    context: { params: Promise<Record<string, string>> }
  ): Promise<NextResponse<TResponse>> => {
    try {
      const user = await requireAuth(req);
      const data = await validateBody(req, schema);
      return await handler(req, context, user, data);
    } catch (error) {
      return handleApiError(error);
    }
  };
}
