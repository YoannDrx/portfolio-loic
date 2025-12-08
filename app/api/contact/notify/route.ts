import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { notifyContactMessage } from "@/lib/notifications";
import { apiLogger } from "@/lib/logger";

// ============================================
// POST /api/contact/notify
// Crée une notification admin pour un nouveau message de contact
// (Route publique - appelée depuis le formulaire contact)
// ============================================

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject } = body as {
      name?: string;
      email?: string;
      subject?: string;
    };

    if (!name || !email) {
      return NextResponse.json(
        { error: "name et email requis" },
        { status: 400 }
      );
    }

    // Créer la notification
    await notifyContactMessage(name, email, subject);

    return NextResponse.json({ success: true });
  } catch (error) {
    apiLogger.error("Erreur notification contact:", error);
    // Ne pas exposer l'erreur - c'est une route publique
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
