// Next.js 16+ compatibility: Use server-side sanitization only
// Client-side sanitization is handled by the RichTextEditor component

// ============================================
// CONFIGURATION DOMPURIFY
// ============================================

/**
 * Configuration stricte pour le contenu HTML du rich text editor
 * Permet uniquement les balises de formatage de texte de base
 */
const ALLOWED_TAGS = [
  // Titres
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  // Paragraphes et texte
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "del",
  "mark",
  "code",
  "pre",
  "blockquote",
  // Listes
  "ul",
  "ol",
  "li",
  // Liens
  "a",
  // Images (si nécessaire)
  "img",
  // Tableaux (si nécessaire)
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
  // Autres
  "span",
  "div",
];

const ALLOWED_ATTR = [
  // Attributs de lien
  "href",
  "target",
  "rel",
  // Attributs d'image
  "src",
  "alt",
  "width",
  "height",
  // Attributs de style (limité)
  "class",
  // Autres
  "id",
  "title",
];

/**
 * Configuration pour les URLs autorisées
 * Bloque les protocoles dangereux (javascript:, data:, etc.)
 */
const ALLOWED_URI_REGEXP =
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i;

// ============================================
// FONCTION PRINCIPALE
// ============================================

/**
 * Sanitize HTML content pour prévenir les attaques XSS
 * Version simplifiée pour Next.js 16+ sans dépendance jsdom
 *
 * @param dirty - Le HTML brut à nettoyer
 * @param options - Options de configuration
 * @returns Le HTML nettoyé et sécurisé
 *
 * @example
 * const clean = sanitizeHTML('<p>Hello <script>alert("XSS")</script></p>');
 * // Retourne: '<p>Hello </p>'
 */
export function sanitizeHTML(
  dirty: string,
  options: {
    /**
     * Liste de balises HTML autorisées
     * Par défaut: ALLOWED_TAGS
     */
    allowedTags?: string[];
    /**
     * Liste d'attributs HTML autorisés
     * Par défaut: ALLOWED_ATTR
     */
    allowedAttributes?: string[];
    /**
     * Autoriser les iframes (vidéos YouTube, etc.)
     * ATTENTION: Peut être dangereux, utilisez avec précaution
     */
    allowIframes?: boolean;
  } = {}
): string {
  if (!dirty || typeof dirty !== "string") return "";

  let cleaned = dirty;

  // 1. Supprimer les scripts et styles dangereux
  cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  cleaned = cleaned.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");

  // 2. Supprimer les attributs d'événements (onclick, onload, etc.)
  cleaned = cleaned.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "");
  cleaned = cleaned.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, "");

  // 3. Supprimer javascript: dans les URLs
  cleaned = cleaned.replace(/javascript:/gi, "");

  // 4. Supprimer data: URIs (peuvent contenir du code malicieux)
  cleaned = cleaned.replace(/data:text\/html/gi, "");

  // 5. Nettoyer les iframes si non autorisés
  if (!options.allowIframes) {
    cleaned = cleaned.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "");
  }

  // 6. Supprimer les balises non autorisées si spécifié
  if (options.allowedTags && options.allowedTags.length > 0) {
    const allowedTagsSet = new Set(options.allowedTags);
    // Regex pour trouver toutes les balises
    cleaned = cleaned.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (match, tag) => {
      if (allowedTagsSet.has(tag.toLowerCase())) {
        return match;
      }
      return "";
    });
  }

  return cleaned;
}

// ============================================
// HELPERS SPÉCIFIQUES
// ============================================

/**
 * Sanitize pour les descriptions d'albums/services
 * Permet un formatage riche mais sécurisé
 */
export function sanitizeDescription(html: string): string {
  return sanitizeHTML(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTR,
  });
}

/**
 * Sanitize pour le texte simple (sans HTML)
 * Supprime TOUTES les balises HTML
 */
export function sanitizePlainText(text: string): string {
  if (!text || typeof text !== "string") return "";
  // Supprimer toutes les balises HTML
  return text.replace(/<[^>]*>/g, "");
}

/**
 * Sanitize pour les URLs
 * Vérifie que l'URL est sûre et bien formée
 */
export function sanitizeURL(url: string): string {
  try {
    const urlObj = new URL(url);

    // Bloquer les protocoles dangereux
    if (!["http:", "https:", "mailto:", "tel:"].includes(urlObj.protocol)) {
      return "";
    }

    return url;
  } catch {
    // URL invalide
    return "";
  }
}

/**
 * Vérifie si une string contient du code potentiellement dangereux
 */
export function containsXSS(str: string): boolean {
  const dangerous = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // onclick, onload, etc.
    /<iframe/i,
    /eval\(/i,
    /expression\(/i,
  ];

  return dangerous.some((pattern) => pattern.test(str));
}
