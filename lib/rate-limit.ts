import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest } from "next/server";
import { ApiError } from "@/lib/api/middleware";

// ============================================
// CONFIGURATION RATE LIMITING
// ============================================

// Vérifier si Upstash est configuré
const isUpstashConfigured =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

// Rate limiters configurés
let uploadLimiter: Ratelimit | null = null;
let loginLimiter: Ratelimit | null = null;
let apiLimiter: Ratelimit | null = null;

// Fallback in-memory pour développement
const inMemoryLimits = new Map<
  string,
  { count: number; resetAt: number }
>();

if (isUpstashConfigured) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  // 5 uploads par minute
  uploadLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    analytics: true,
    prefix: "ratelimit:upload",
  });

  // 10 tentatives de login par 10 minutes
  loginLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "10 m"),
    analytics: true,
    prefix: "ratelimit:login",
  });

  // 100 requêtes API par minute
  apiLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "1 m"),
    analytics: true,
    prefix: "ratelimit:api",
  });
}

// ============================================
// HELPERS
// ============================================

/**
 * Extraire l'IP de la requête
 */
function getIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

/**
 * Rate limiting en mémoire (fallback pour développement)
 */
function inMemoryRateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): { success: boolean; remaining: number } {
  const now = Date.now();
  const key = identifier;
  const entry = inMemoryLimits.get(key);

  if (!entry || now > entry.resetAt) {
    // Nouvelle fenêtre
    inMemoryLimits.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return { success: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    // Limite atteinte
    return { success: false, remaining: 0 };
  }

  // Incrémenter
  entry.count++;
  return { success: true, remaining: limit - entry.count };
}

// ============================================
// FONCTIONS PUBLIQUES
// ============================================

/**
 * Rate limit pour les uploads
 */
export async function checkUploadRateLimit(req: NextRequest): Promise<void> {
  const identifier = getIP(req);

  if (uploadLimiter) {
    const { success, remaining } = await uploadLimiter.limit(identifier);

    if (!success) {
      throw new ApiError(
        429,
        `Trop de requêtes. Limite: 5 uploads par minute. Réessayez dans quelques instants.`,
        "RATE_LIMIT_EXCEEDED"
      );
    }
  } else {
    // Fallback in-memory
    const { success } = inMemoryRateLimit(
      `upload:${identifier}`,
      5,
      60 * 1000
    );

    if (!success) {
      throw new ApiError(
        429,
        "Trop de requêtes. Réessayez dans quelques instants.",
        "RATE_LIMIT_EXCEEDED"
      );
    }
  }
}

/**
 * Rate limit pour le login
 */
export async function checkLoginRateLimit(req: NextRequest): Promise<void> {
  const identifier = getIP(req);

  if (loginLimiter) {
    const { success, remaining } = await loginLimiter.limit(identifier);

    if (!success) {
      throw new ApiError(
        429,
        `Trop de tentatives de connexion. Limite: 10 par 10 minutes. Réessayez plus tard.`,
        "RATE_LIMIT_EXCEEDED"
      );
    }
  } else {
    // Fallback in-memory
    const { success } = inMemoryRateLimit(
      `login:${identifier}`,
      10,
      10 * 60 * 1000
    );

    if (!success) {
      throw new ApiError(
        429,
        "Trop de tentatives de connexion. Réessayez plus tard.",
        "RATE_LIMIT_EXCEEDED"
      );
    }
  }
}

/**
 * Rate limit général pour les API
 */
export async function checkApiRateLimit(req: NextRequest): Promise<void> {
  const identifier = getIP(req);

  if (apiLimiter) {
    const { success, remaining } = await apiLimiter.limit(identifier);

    if (!success) {
      throw new ApiError(
        429,
        `Trop de requêtes. Limite: 100 par minute.`,
        "RATE_LIMIT_EXCEEDED"
      );
    }
  } else {
    // Fallback in-memory
    const { success } = inMemoryRateLimit(
      `api:${identifier}`,
      100,
      60 * 1000
    );

    if (!success) {
      throw new ApiError(
        429,
        "Trop de requêtes. Réessayez dans quelques instants.",
        "RATE_LIMIT_EXCEEDED"
      );
    }
  }
}

/**
 * Nettoyer périodiquement le cache in-memory
 */
if (!isUpstashConfigured && typeof setInterval !== "undefined") {
  setInterval(
    () => {
      const now = Date.now();
      for (const [key, entry] of inMemoryLimits.entries()) {
        if (now > entry.resetAt) {
          inMemoryLimits.delete(key);
        }
      }
    },
    5 * 60 * 1000
  ); // Toutes les 5 minutes
}

// Log au démarrage
if (process.env.NODE_ENV === "development") {
  console.log(
    `[Rate Limiting] Mode: ${isUpstashConfigured ? "Upstash Redis" : "In-Memory (dev only)"}`
  );
}
