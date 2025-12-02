import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export type NotificationType = "new_content" | "contact_message";

export interface NotificationData {
  contentType?: "album" | "video" | "service";
  contentId?: string;
  locale?: string;
  [key: string]: unknown;
}

/**
 * Crée une notification dans la base de données
 */
export async function createNotification(
  type: NotificationType,
  title: string,
  message: string,
  data?: NotificationData
) {
  try {
    const notification = await prisma.notification.create({
      data: {
        type,
        title,
        message,
        data: data ? (data as Prisma.InputJsonValue) : undefined,
      },
    });
    return notification;
  } catch (error) {
    console.error("Erreur création notification:", error);
    // Ne pas throw - les notifications ne doivent pas bloquer les opérations principales
    return null;
  }
}

/**
 * Notification pour nouveau contenu créé
 */
export async function notifyNewContent(
  contentType: "album" | "video" | "service",
  contentId: string,
  title: string
) {
  const typeLabels = {
    album: "Album",
    video: "Vidéo",
    service: "Service",
  };

  return createNotification(
    "new_content",
    `Nouveau ${typeLabels[contentType]}`,
    `"${title}" a été créé`,
    { contentType, contentId }
  );
}

/**
 * Notification pour message de contact
 */
export async function notifyContactMessage(
  senderName: string,
  senderEmail: string,
  subject?: string
) {
  return createNotification(
    "contact_message",
    "Nouveau message de contact",
    `De ${senderName} (${senderEmail})${subject ? ` - ${subject}` : ""}`,
    { senderName, senderEmail, subject }
  );
}
