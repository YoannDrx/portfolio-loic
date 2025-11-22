# 🚀 Dashboard Admin - Phase 1 : Upload & Sécurité

## ✅ Implémentations terminées

### 1. Système d'Upload de fichiers

#### Route API `/api/admin/upload`
- ✅ Upload vers **Vercel Blob** (stockage cloud)
- ✅ Validation du type de fichier (JPEG, PNG, WebP uniquement)
- ✅ Validation de la taille (max 5MB)
- ✅ Rate limiting (5 uploads/minute)
- ✅ Authentification requise (admin uniquement)

#### Composant `ImageUpload`
- ✅ Drag & drop d'images
- ✅ Preview en temps réel
- ✅ Progress bar pendant l'upload
- ✅ Gestion des erreurs avec toasts
- ✅ Support dark mode
- ✅ Suppression d'image uploadée

**Utilisation :**
```tsx
import { ImageUpload } from "@/components/admin/ImageUpload";

<ImageUpload
  value={formData.img}
  onChange={(url) => setFormData({ ...formData, img: url })}
  label="Image de couverture *"
  description="Format: JPEG, PNG, WebP (max 5MB)"
/>
```

---

### 2. Sécurité renforcée

#### Validation Zod côté serveur
- ✅ Schemas créés dans `/lib/validations/schemas.ts`
- ✅ Validation pour Albums, Videos, Services
- ✅ Validation des query params (pagination, filtres)
- ✅ Messages d'erreur français et contextuels

**Schemas disponibles :**
- `albumCreateSchema` / `albumUpdateSchema`
- `videoCreateSchema` / `videoUpdateSchema`
- `serviceCreateSchema` / `serviceUpdateSchema`
- `albumsQuerySchema` / `videosQuerySchema` / `servicesQuerySchema`

#### Sanitization HTML (Anti-XSS)
- ✅ Helper créé dans `/lib/sanitize.ts`
- ✅ Utilise **DOMPurify** (isomorphic)
- ✅ Configuration stricte pour rich text
- ✅ Bloque les scripts, iframes non autorisés
- ✅ Appliqué automatiquement dans les API routes

**Fonctions disponibles :**
```ts
import { sanitizeDescription, sanitizePlainText, sanitizeURL } from "@/lib/sanitize";

const cleanHTML = sanitizeDescription(dirtyHTML);
```

#### Rate Limiting
- ✅ Implémenté dans `/lib/rate-limit.ts`
- ✅ Support **Upstash Redis** (production)
- ✅ Fallback **in-memory** (développement)
- ✅ 3 limiters configurés :
  - Upload : 5 requêtes/minute
  - Login : 10 tentatives/10 minutes
  - API général : 100 requêtes/minute

#### Middleware Auth centralisé
- ✅ Créé dans `/lib/api/middleware.ts`
- ✅ Fonctions helpers :
  - `requireAuth()` - Vérification admin
  - `validateBody()` - Validation Zod du body
  - `validateQuery()` - Validation Zod des query params
  - `handleApiError()` - Gestion centralisée des erreurs
  - `withAuth()` - Wrapper pour routes avec auth
  - `withAuthAndValidation()` - Wrapper auth + validation

**Exemple d'utilisation :**
```ts
import { withAuthAndValidation, createdResponse } from "@/lib/api/middleware";
import { albumCreateSchema } from "@/lib/validations/schemas";
import { sanitizeDescription } from "@/lib/sanitize";

export const POST = withAuthAndValidation(
  albumCreateSchema,
  async (req, context, user, data) => {
    const sanitizedData = {
      ...data,
      descriptionsFr: sanitizeDescription(data.descriptionsFr),
      descriptionsEn: sanitizeDescription(data.descriptionsEn),
    };

    const album = await prisma.album.create({
      data: { ...sanitizedData, createdById: user.id },
    });

    return createdResponse(album);
  }
);
```

---

### 3. API Routes refactorisées

#### Albums
- ✅ `GET /api/admin/albums` - Liste avec pagination & filtres
- ✅ `POST /api/admin/albums` - Création avec validation Zod + sanitization
- ✅ `GET /api/admin/albums/[id]` - Détail d'un album
- ✅ `PATCH /api/admin/albums/[id]` - Mise à jour avec validation
- ✅ `DELETE /api/admin/albums/[id]` - Suppression avec vérification

**Nouveautés :**
- Pagination (`?page=0&limit=20`)
- Recherche (`?search=titre`)
- Filtres (`?style=film&published=true`)
- Tri (`?sortBy=date&sortOrder=desc`)
- Validation automatique
- Sanitization HTML
- Gestion d'erreurs améliorée

---

### 4. Formulaires améliorés

#### AlbumForm
- ✅ Remplacement inputs URL par `ImageUpload`
- ✅ Upload direct pour `img` et `poster`
- ✅ Preview des images

#### ServiceForm
- ✅ Remplacement inputs URL par `ImageUpload`
- ✅ Upload direct pour `largeImg` et `poster`
- ✅ Preview des images

#### VideoForm
- ✅ **Auto-extraction ID YouTube** depuis URL complète
- ✅ **Auto-fetch thumbnail** depuis YouTube
- ✅ Bouton "Auto-fetch" pour récupérer le thumbnail
- ✅ Preview du thumbnail
- ✅ **Fix incohérence** : Types corrigés vers `OriginalMusic | Sync | MusicToPicture`

**Exemple d'utilisation VideoForm :**
1. Collez l'URL YouTube complète : `https://youtube.com/watch?v=dQw4w9WgXcQ`
2. L'ID est automatiquement extrait : `dQw4w9WgXcQ`
3. Le thumbnail est auto-rempli : `https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg`
4. Preview visible immédiatement

---

## 📦 Dépendances installées

```json
{
  "@vercel/blob": "^2.0.0",
  "isomorphic-dompurify": "^2.33.0",
  "react-dropzone": "^14.3.8",
  "@upstash/ratelimit": "^2.0.7",
  "@upstash/redis": "^1.35.6"
}
```

---

## 🔧 Configuration requise

### Variables d'environnement (Vercel Blob)

Ajoutez dans `.env.local` :

```env
# Vercel Blob (requis pour upload)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxx

# Upstash Redis (optionnel, pour rate limiting en production)
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxx
```

**⚠️ Important :**
- Sans `BLOB_READ_WRITE_TOKEN`, l'upload ne fonctionnera pas
- Sans Upstash Redis, le rate limiting utilisera un fallback in-memory (OK pour dev, pas pour prod)

---

## 📝 Fichiers créés/modifiés

### Nouveaux fichiers
```
lib/
├── validations/
│   └── schemas.ts              # Schemas Zod (albums, videos, services)
├── api/
│   └── middleware.ts           # Middleware auth + validation + errors
├── sanitize.ts                 # Sanitization HTML (DOMPurify)
└── rate-limit.ts               # Rate limiting (Upstash + fallback)

components/admin/
└── ImageUpload.tsx             # Composant upload drag & drop

app/api/admin/
└── upload/
    └── route.ts                # Route API upload vers Vercel Blob
```

### Fichiers modifiés
```
app/api/admin/
├── albums/
│   ├── route.ts                # Refactoré avec middleware + validation
│   └── [id]/route.ts           # Refactoré avec middleware + validation

components/admin/
├── album-form.tsx              # Intégration ImageUpload
├── service-form.tsx            # Intégration ImageUpload
└── video-form.tsx              # Auto-fetch YouTube + fix types
```

---

## 🚦 Tests recommandés

### 1. Upload d'images
1. Aller sur `/fr/admin/albums/new`
2. Drag & drop une image PNG < 5MB → ✅ Upload OK
3. Essayer une image > 5MB → ❌ Erreur "Fichier trop volumineux"
4. Essayer un PDF → ❌ Erreur "Format non supporté"
5. Vérifier la preview → ✅ Image visible

### 2. Validation Zod
1. Créer un album sans titre → ❌ Erreur validation
2. Créer un album avec URL invalide → ❌ Erreur validation
3. Créer un album valide → ✅ Success

### 3. Auto-fetch YouTube
1. Aller sur `/fr/admin/videos/new`
2. Coller URL YouTube : `https://youtube.com/watch?v=dQw4w9WgXcQ`
3. Vérifier ID extrait → ✅ `dQw4w9WgXcQ`
4. Vérifier thumbnail auto-rempli → ✅ URL YouTube
5. Vérifier preview → ✅ Image visible

### 4. Rate limiting
1. Uploader 6 images rapidement → ❌ 6ème bloquée (429 Too Many Requests)
2. Attendre 1 minute → ✅ Upload à nouveau possible

---

## ⚠️ Problèmes connus

### 1. Vercel Blob en local
Le token Vercel Blob fonctionne en production et local, mais nécessite une connexion internet.

### 2. Node version warning
Vous avez Node 22.8.0 mais jsdom requiert 22.12.0+. Pour l'instant, on ignore le warning avec `--ignore-engines`. Mettez à jour Node si possible :
```bash
nvm install 22.12.0
nvm use 22.12.0
```

### 3. Upstash non configuré
Si vous n'avez pas configuré Upstash Redis, le rate limiting utilisera un fallback in-memory. C'est OK pour le développement, mais pas recommandé en production.

---

## 🎯 Prochaines étapes (Phase 2)

La Phase 1 est **TERMINÉE** ✅

**Phase 2 - UX Formulaires premium** :
1. Migration vers `react-hook-form` + validation temps réel
2. Prévisualisation avant publication
3. Amélioration feedback utilisateur (skeletons, empty states)
4. Optimistic updates avec TanStack Query

**Phase 3 - Recherche et filtres avancés** :
1. Pagination côté serveur
2. Filtres multiples (style, date, statut)
3. Recherche full-text
4. Tri personnalisé

Voulez-vous que je commence la **Phase 2** ?

---

## 📚 Documentation supplémentaire

- [Vercel Blob Docs](https://vercel.com/docs/storage/vercel-blob)
- [Zod Docs](https://zod.dev/)
- [DOMPurify](https://github.com/cure53/DOMPurify)
- [Upstash Rate Limiting](https://upstash.com/docs/oss/sdks/ts/ratelimit/overview)
