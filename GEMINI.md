# Tokyo Next.js - Loïc Ghanem Portfolio

## Project Overview

This project is a modern, high-performance personal portfolio website for music composer and producer Loïc Ghanem. It showcases his work (Albums, Videos, Services) and includes a comprehensive Admin Dashboard for content management.

### Tech Stack

*   **Framework:** Next.js 16 (App Router)
*   **Language:** TypeScript
*   **UI Library:** React 19
*   **Styling:** Tailwind CSS, Radix UI (shadcn/ui), Framer Motion
*   **Database:** PostgreSQL (via Prisma ORM)
*   **Authentication:** Better Auth (with Email/Password credential provider)
*   **File Storage:** Vercel Blob
*   **Internationalization:** `next-intl` (English & French)
*   **3D Graphics:** Three.js / React Three Fiber

## Getting Started

### Prerequisites

*   Node.js 22 (managed via `.nvmrc`)
*   npm or yarn

### Key Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start the development server on port 3000 |
| `npm run build` | Build the application for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npx prisma studio` | Open Prisma Studio to view/edit database records |
| `npx prisma generate` | Generate Prisma Client types |
| `npx prisma migrate dev` | Create and apply database migrations |

## Architecture

### Directory Structure

*   `app/`: Main application routes (App Router).
    *   `[locale]/`: Localized routes (public and admin).
    *   `api/`: API routes for Auth, Admin actions, etc.
*   `components/`: React components.
    *   `ui/`: Reusable UI primitives (buttons, inputs, cards) - largely based on shadcn/ui.
    *   `admin/`: Components specific to the admin dashboard.
    *   `home/`, `about/`, `contact/`: Feature-specific components.
*   `lib/`: Utility functions and core configurations.
    *   `prisma.ts`: Singleton Prisma client instance.
    *   `auth.ts`: Better Auth configuration.
    *   `utils.ts`: General helper functions (cn, etc.).
*   `prisma/`: Database schema (`schema.prisma`) and migrations.
*   `messages/`: Localization files (`en.json`, `fr.json`).
*   `styles/`: Global styles and Tailwind configuration.

### Key Features

1.  **Admin Dashboard (`/admin`):**
    *   Secured via Better Auth (Admin role required).
    *   CRUD operations for Albums, Videos, and Services.
    *   Site Settings management (SEO, Social Links, Content toggles).
    *   **Versioning System:** Tracks changes to content (Albums, Videos, Services) allowing rollback/restore.
    *   **Media:** Drag-and-drop image uploads via Vercel Blob.

2.  **Public Site:**
    *   **Visuals:** "Obsidian" dark theme with Neon accents.
    *   **Multimedia:** Custom music player, YouTube video integration, Audio visualization (Three.js).
    *   **Performance:** Server Components for initial load, Client Components for interactivity.

## Development Conventions

*   **TypeScript:** Strict type safety is enforced. Use Zod for schema validation (API inputs, Forms).
*   **Server vs. Client:** Default to Server Components. Use `"use client"` only for components requiring React hooks (state, effects) or browser-only APIs.
*   **Data Fetching:**
    *   **Server Components:** Fetch data directly using `prisma` client.
    *   **Client Components:** Pass data as props from parent Server Components. Avoid fetching in `useEffect` if possible.
*   **Styling:** Use Tailwind CSS utility classes. Use `cn()` utility for conditional class merging.
*   **Internationalization:** All text must be internationalized using `next-intl`. Keys are stored in `messages/*.json`.
*   **Database:** Always update `schema.prisma` and run migrations when changing the data model.

## Admin Dashboard Documentation

For detailed information on the Admin Dashboard's architecture, features, and workflows, refer to `ADMIN_DASHBOARD_COMPLETE.md`.
