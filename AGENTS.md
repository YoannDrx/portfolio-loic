# Repository Guidelines

Guide for contributing to this Next.js app with Tailwind and Prisma/PostgreSQL.

## Project Structure & Module Organization
- Public routes live in `app/[locale]` (home, about, albums, services, videos, contact); admin UI/auth and API handlers are under `app/admin`, `app/login`, and `app/api/*`.
- Shared UI is in `components` (`components/ui` for primitives, feature folders for widgets); logic sits in `hooks`, `lib`, and `utilis/linkActiveChecker.js`.
- Localization strings are in `messages/en.json` and `messages/fr.json` with routing helpers in `i18n/`; global styles in `styles/`, assets in `public/`.
- Database schema/migrations live in `prisma/` (see `schema.prisma`, `prisma.config.ts`). Admin seed scripts: `scripts/create-admin*.ts`.

## Build, Test, and Development Commands
- `nvm use` (Node 22 via `.nvmrc`), then `npm install`.
- `npm run dev` — start the local server at `localhost:3000`; `npm run build` / `npm run start` for production flow.
- `npm run lint` — ESLint per `eslint.config.mjs`.
- Prisma: set `DATABASE_URL` in `.env.local`, then `npx prisma migrate dev --name <change>` or `npx prisma generate` after schema edits.

## Coding Style & Naming Conventions
- Prefer TypeScript and path aliases `@/...`; functional React components with PascalCase filenames, hooks prefixed with `use`, utilities camelCase.
- Tailwind is the styling default (tokens in `tailwind.config.ts`); use `clsx`/`tailwind-merge` when composing classes and keep dark/light variants aligned.
- ESLint enforces consistent type imports, warns on `any`/unused vars (prefix intentional ones with `_`), prefers `const`, and allows JSX without explicit React import. Follow the prevailing 2-space indent and single quotes.
- Localize user-facing text and add keys to both `messages/en.json` and `messages/fr.json`.

## Testing Guidelines
- No formal test runner yet; run `npm run lint` and smoke-test public pages, admin auth, locale switch, light/dark, and mobile before opening a PR. If you add tests, colocate them as `<name>.test.tsx` near the component/handler and note any new tooling in the PR.

## Commit & Pull Request Guidelines
- Use short, imperative commit subjects similar to the history (`fix card albums home`, `ajout dark light theme`) and add a scope when helpful (`fix: admin sidebar hover`).
- PRs should include a brief summary, linked issue, UI screenshots/Looms (both themes + mobile when relevant), and callouts for DB migrations or new env vars. Note translation updates and schema changes explicitly for reviewers.

## Security & Configuration Tips
- Keep secrets out of git; use `.env.local` for `DATABASE_URL`, auth/email providers, and third-party tokens. Avoid logging credentials (ESLint warns on `console`) and scrub sensitive data from Prisma migrations.
