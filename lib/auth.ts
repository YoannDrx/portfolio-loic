import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createAuthMiddleware } from "better-auth/api";
import { prisma } from "./prisma";
import { logAuth, logSettingsChange } from "./activity-logger";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Désactivé pour simplifier l'admin
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 jours
    updateAge: 60 * 60 * 24, // 1 jour
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        required: false,
      },
    },
  },
  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ],
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      // Log des connexions réussies
      if (ctx.path === "/sign-in/email") {
        const newSession = ctx.context.newSession;
        if (newSession) {
          await logAuth("login", newSession.user.id, undefined, {
            email: newSession.user.email,
          });
        }
      }

      // Log des déconnexions
      if (ctx.path === "/sign-out") {
        // Pour le sign-out, on récupère le userId depuis la session actuelle avant déconnexion
        const session = ctx.context.session;
        if (session) {
          await logAuth("logout", session.user.id);
        }
      }

      // Log des changements de mot de passe
      if (ctx.path === "/change-password") {
        const session = ctx.context.session;
        if (session) {
          await logSettingsChange("password_change", session.user.id);
        }
      }

      // Log des changements d'email
      if (ctx.path === "/change-email") {
        const session = ctx.context.session;
        if (session) {
          const body = ctx.body as { newEmail?: string } | undefined;
          await logSettingsChange("email_change", session.user.id, {
            newEmail: body?.newEmail,
          });
        }
      }
    }),
  },
});

export type Session = typeof auth.$Infer.Session;
