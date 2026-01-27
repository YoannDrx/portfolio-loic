# CLAUDE.md

---

## ⚡ AUTO-START mgrep (à faire automatiquement)

**Dès que tu commences à travailler sur ce projet, lance cette commande en background :**

```bash
mgrep watch --store "portfolio-loic" &
```

> Lance cette commande UNE SEULE FOIS au début de la session. Ne la relance pas à chaque question.

---

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## mgrep - Assistant de recherche de code

**mgrep est l'outil principal pour explorer ce codebase.** Il retourne une réponse en langage naturel + les sources pertinentes.

### Store : `portfolio-loic`

### Lancer le watch (à faire à chaque ouverture du projet)

```bash
cd ~/Projets/portfolio-loic
mgrep watch --store "portfolio-loic"
```

> Garde ce terminal ouvert : il surveille les modifications en temps réel.

### Commande de recherche

```bash
mgrep "ta question en langage naturel" --store "portfolio-loic" -a -m <nombre>
```

### Paramètres

| Paramètre                  | Description                                 |
| -------------------------- | ------------------------------------------- |
| `--store "portfolio-loic"` | **Obligatoire** - le store indexé du projet |
| `-a`                       | Active la réponse en langage naturel        |
| `-m <n>`                   | Nombre de résultats (minimum 10)            |

### Ajuster `-m` selon la complexité

| Type de requête                         | `-m` recommandé |
| --------------------------------------- | --------------- |
| Question simple (1-2 fichiers)          | 10              |
| Question moyenne (flow, feature)        | 20-30           |
| Question complexe (debug, architecture) | 30-50           |

### Stratégie pour requêtes complexes

Lance plusieurs mgrep en parallèle plutôt qu'une seule requête surchargée :

```bash
mgrep "comment fonctionne la navigation et la sidebar" --store "portfolio-loic" -a -m 20
mgrep "comment est intégré le lecteur SoundCloud" --store "portfolio-loic" -a -m 20
mgrep "comment fonctionne la galerie photos avec PhotoSwipe" --store "portfolio-loic" -a -m 20
```

### Règles

- **OBLIGATOIRE** : Utilise mgrep pour TOUTE recherche de code. N'utilise JAMAIS grep, Grep tool, ou Glob.
- **Langage naturel** : Parle à mgrep comme à un collègue
  - ❌ `"sidebar navigation soundcloud"` (mots-clés)
  - ✅ `"Comment fonctionne la sidebar avec le lecteur SoundCloud intégré ?"` (question naturelle)

---

## Subagents (Task tool)

**Les subagents n'héritent PAS des instructions de ce fichier.**

Quand tu lances un subagent, copie-colle cette section mgrep dans le prompt du subagent.

---

## Informations du projet

Portfolio/Site web personnel pour un musicien construit avec Next.js 15. Le site présente différentes sections : présentation, services, albums photos, et vidéos, avec un lecteur SoundCloud intégré dans la sidebar.

**Stack technique :**

- Next.js 15.2.5 (Pages Router)
- React 18.2.0
- SCSS pour les styles
- Node.js 22

## Commandes de développement

```bash
# Démarrer le serveur de développement
npm run dev      # Port 3000 par défaut

# Build de production
npm run build

# Démarrer en mode production
npm start

# Linter
npm run lint
```

## Architecture du code

### Structure Pages Router (Next.js)

Le projet utilise le **Pages Router** classique de Next.js (pas l'App Router) :

- `pages/` : Routes de l'application (home, about, service, albums, videos, contact, 404)
- `pages/_app.js` : Point d'entrée global avec ThemeProvider, Sidebar, AOS init, ToastContainer
- `pages/_document.js` : Structure HTML customisée
- `pages/index.js` : Page d'accueil/splash screen

### Organisation des composants

```
components/
├── about/        # Composants de la page à propos
├── album/        # Galerie photos avec PhotoSwipe
├── contact/      # Formulaire de contact (EmailJS)
├── home/         # Hero section et intro
├── service/      # Présentation des services
├── sidebar/      # Menu latéral + logo + lecteur SoundCloud
├── social-share/ # Boutons de partage réseaux sociaux
├── switch/       # Toggle thème clair/sombre
└── videos/       # Galerie vidéos YouTube
```

### Données statiques

Le dossier `data/` contient les configurations en JavaScript :

- `sidebarData.js` : Items de navigation (Home, About, Service, Albums, Videos)
- `albumsData.js` : Données des galeries photos
- `videoData.js` : Métadonnées des vidéos YouTube
- `servicesData.js` : Liste des services proposés

**Important** : Ces fichiers utilisent `module.exports` (CommonJS), pas ES modules.

### Système de thèmes

Le projet utilise `next-themes` pour le dark mode :

- Provider configuré dans `_app.js` avec `attribute="class"`
- Toggle switch accessible via `ThemeSwitch` component
- Styles SCSS organisés dans `styles/scss/`

### Features clés

**Sidebar permanente** :

- Logo du site
- Navigation principale
- Lecteur SoundCloud embarqué (iframe avec autoplay)
- Menu hamburger responsive
- Scroll lock sur mobile quand le menu est ouvert

**Animations** :

- AOS (Animate On Scroll) initialisé globalement dans `_app.js`
- Slick Carousel pour les galeries

**Galeries** :

- Photos : PhotoSwipe Gallery (`react-photoswipe-gallery`)
- Vidéos : Modales vidéo YouTube (`react-modal-video`)

**Utilitaires** :

- `utilis/linkActiveChecker.js` : Détection du lien actif pour la navigation

### Configuration Next.js

`next.config.js` :

- `reactStrictMode: true`
- Remote patterns pour images YouTube (`img.youtube.com`)

### Node version

Le projet requiert Node.js 22 (spécifié dans `package.json` engines et `.nvmrc`).

## Notes de développement

- Utiliser `<Image />` de Next.js pour toutes les images (migration récente depuis `<img/>`)
- Les images statiques sont dans `/public/img/`
- EmailJS est configuré pour le formulaire de contact
- Le routeur Next.js est accessible via `useRouter()` pour la navigation et détection de route active
