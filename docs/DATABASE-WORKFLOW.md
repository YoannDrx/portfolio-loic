# Workflow Base de Données

Ce document décrit le système de gestion des données du projet, incluant le seeding, les backups, et la séparation dev/prod.

## Architecture

```
seed/
├── index.ts           # Script principal de seeding
├── backup.ts          # Export des données vers JSON
├── clean.ts           # Suppression complète de la BD
├── utils.ts           # Utilitaires (logger, parseArgs, etc.)
├── data/              # Fichiers JSON sources (synchronisés avec prod)
│   ├── users.json
│   ├── accounts.json
│   ├── site_settings.json
│   ├── navigation_items.json
│   ├── albums.json
│   ├── videos.json
│   ├── services.json
│   ├── resume_entries.json
│   └── cv.json
└── backups/           # Backups horodatés (non versionnés)
```

## Environnements

### Base Locale (Docker)

```bash
# Démarrer PostgreSQL local
yarn db:dev

# Arrêter
yarn db:dev:stop

# Voir les logs
yarn db:dev:logs
```

**Configuration Docker** (`docker-compose.yml`) :

- Image : `postgres:16-alpine`
- Container : `portfolio-loic-db`
- Base : `portfolio-loic`
- User : `dev` / Password : `dev`
- Port : `5432`

### Base de Production (Neon)

La base de production est hébergée sur Neon. Les credentials sont dans `.env` (non versionné).

### Switcher entre Dev et Prod

Modifier `.env.local` :

```bash
# === BASE DE DONNÉES ===
# Décommenter UNE SEULE ligne selon l'environnement voulu

# Base locale (Docker)
DATABASE_URL="postgresql://dev:dev@localhost:5432/portfolio-loic"

# Base de production (Neon)
# DATABASE_URL="postgresql://neondb_owner:***@neon.tech/neondb"
```

---

## Commandes Disponibles

### Seeding

| Commande                | Description                                      |
| ----------------------- | ------------------------------------------------ |
| `yarn db:seed`          | Seed additif (ne crée que les nouvelles entités) |
| `yarn db:seed:force`    | Seed avec écrasement des entités existantes      |
| `yarn db:seed:albums`   | Seed uniquement les albums                       |
| `yarn db:seed:videos`   | Seed uniquement les vidéos                       |
| `yarn db:seed:services` | Seed uniquement les services                     |
| `yarn db:seed:resume`   | Seed uniquement les entrées CV                   |
| `yarn db:seed:settings` | Seed uniquement les paramètres du site           |
| `yarn db:seed:users`    | Seed uniquement les utilisateurs                 |

### Backup

| Commande                   | Description                                  |
| -------------------------- | -------------------------------------------- |
| `yarn db:backup`           | Crée un backup horodaté dans `seed/backups/` |
| `yarn db:backup:overwrite` | Écrase les fichiers dans `seed/data/`        |

### Nettoyage

| Commande            | Description                               |
| ------------------- | ----------------------------------------- |
| `yarn db:clean`     | Vide la BD (demande confirmation)         |
| `yarn db:clean:yes` | Vide la BD sans confirmation (CI/scripts) |

### Reset

| Commande             | Description                      |
| -------------------- | -------------------------------- |
| `yarn db:reset`      | Backup + reset migrations        |
| `yarn db:reset:seed` | Backup + reset migrations + seed |
| `yarn db:dev:reset`  | Reset local + seed               |

### Prisma

| Commande                 | Description                     |
| ------------------------ | ------------------------------- |
| `yarn db:migrate`        | Créer une nouvelle migration    |
| `yarn db:migrate:deploy` | Appliquer les migrations (prod) |
| `yarn db:studio`         | Ouvrir Prisma Studio            |

---

## Comportement du Seed

### Mode Additif (par défaut)

```bash
yarn db:seed
```

| Situation               | Comportement |
| ----------------------- | ------------ |
| Entité n'existe pas     | ✅ Créée     |
| Entité existe (même ID) | ⏭️ Ignorée   |
| Entité créée via admin  | ⏭️ Préservée |

**Avantage** : Les modifications faites par l'utilisateur via le panel admin ne sont jamais écrasées.

### Mode Force

```bash
yarn db:seed:force
```

| Situation               | Comportement                |
| ----------------------- | --------------------------- |
| Entité n'existe pas     | ✅ Créée                    |
| Entité existe (même ID) | 🔄 Mise à jour              |
| Entité créée via admin  | ⏭️ Préservée (ID différent) |

**Utilisation** : Quand tu veux forcer la mise à jour des données depuis les fichiers JSON.

---

## Workflows

### Développement Quotidien

```bash
# 1. Démarrer la base locale
yarn db:dev

# 2. Lancer le serveur de dev
yarn dev

# 3. Travailler normalement...
```

### Récupérer les Données de Production

Quand l'utilisateur a fait des modifications via le panel admin et que tu veux les récupérer :

```bash
# 1. Pointer vers la prod temporairement
# Modifier .env.local pour utiliser l'URL Neon

# 2. Faire un backup de la prod
yarn db:backup:overwrite

# 3. Revenir à la base locale
# Modifier .env.local pour utiliser l'URL locale

# 4. Appliquer les données de prod en local
yarn db:seed
```

### Ajouter du Nouveau Contenu de Seed

```bash
# 1. Modifier les fichiers dans seed/data/*.json

# 2. Seeder (mode additif = n'ajoute que le nouveau)
yarn db:seed
```

### Reset Complet Local

```bash
# Backup + Reset migrations + Seed
yarn db:dev:reset
```

---

## Fichiers de Configuration

### `.env.local` (non versionné)

Variables d'environnement pour le développement local :

```bash
DATABASE_URL="postgresql://dev:dev@localhost:5432/portfolio-loic"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
BETTER_AUTH_SECRET="your-secret-key"
```

### `.env.development` (non versionné)

Template pour la configuration locale :

```bash
DATABASE_URL="postgresql://dev:dev@localhost:5432/portfolio-loic"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
BETTER_AUTH_SECRET="dev-secret-key"
```

### `prisma.config.ts`

Configuration Prisma qui charge automatiquement `.env.local` en priorité sur `.env`.

---

## Sécurité

### Commandes Destructives

Les commandes suivantes demandent une confirmation avant exécution :

- `yarn db:clean` - Demande de taper "yes"
- `yarn db:reset` - Fait un backup automatique avant

Pour bypasser la confirmation (CI/scripts) :

```bash
yarn db:clean:yes
```

### En Production

**NE JAMAIS exécuter sur la production** :

- ❌ `yarn db:clean`
- ❌ `yarn db:reset`
- ❌ `yarn db:dev:reset`

**Commandes sûres pour la production** :

- ✅ `yarn db:seed` (additif, ne supprime rien)
- ✅ `yarn db:backup` (lecture seule)
- ✅ `yarn db:migrate:deploy` (applique les migrations)

---

## Structure des Données Seedées

### Entités Principales

| Entité             | Fichier                 | Description                             |
| ------------------ | ----------------------- | --------------------------------------- |
| `users`            | `users.json`            | Utilisateurs admin                      |
| `accounts`         | `accounts.json`         | Comptes d'authentification              |
| `site_settings`    | `site_settings.json`    | Paramètres globaux du site              |
| `navigation_items` | `navigation_items.json` | Items de menu                           |
| `albums`           | `albums.json`           | Galeries photos/albums                  |
| `videos`           | `videos.json`           | Vidéos YouTube                          |
| `services`         | `services.json`         | Services proposés                       |
| `resume_entries`   | `resume_entries.json`   | Entrées CV                              |
| `cv`               | `cv.json`               | CV complet avec sections, skills, links |

### Ordre de Seeding

Les entités sont seedées dans cet ordre pour respecter les contraintes de clés étrangères :

1. `users`
2. `accounts`
3. `site_settings`
4. `navigation_items`
5. `albums`
6. `videos`
7. `services`
8. `resume_entries`
9. `cv`

---

## Troubleshooting

### La base locale ne démarre pas

```bash
# Vérifier que Docker est lancé
docker info

# Redémarrer le conteneur
yarn db:dev:stop
yarn db:dev
```

### Prisma utilise la mauvaise base

Vérifier que `.env.local` contient la bonne `DATABASE_URL` et qu'elle n'est pas commentée.

### Les migrations ne s'appliquent pas

```bash
# Forcer l'application du schéma
npx prisma db push

# Ou reset complet
yarn db:dev:reset
```

### Erreur "relation does not exist"

Le schéma n'est pas synchronisé :

```bash
npx prisma db push
```
