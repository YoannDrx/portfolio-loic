# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
