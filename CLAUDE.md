@AGENTS.md

# Xoro Visuals site

Next.js 16 (App Router, Cache Components, Partial Prefetching), React 19, TypeScript, CSS Modules + global tokens, GSAP. npm.

## Commands
- `npm run dev` — dev server
- `npm run typecheck` / `npm run lint`
- `npm run test:e2e` — production build + Playwright (desktop + mobile). Uses a mock webhook on :3201 and `next start` on :3200.

## Where things live
- Content (edit these, not components): `src/content/` — `projects.ts`, `services.ts`, `process.ts`, `pricing.ts`, `site.ts`.
- Media: `public/media/`. `npm run media` (scripts/build-media.sh) builds `public/media/work/*` and `reel.mp4` from stills in `raw/`. Current stills are AI samples, not client work.
- Tokens and motion pre-states: `src/app/globals.css`.

## Rules
- Load the project skills before UI or motion work: `xoro-visual-direction`, `xoro-motion`.
- Never invent clients, testimonials, results, awards or prices. Keep `kind` (commissioned/spec/original) truthful.
- The contact form must never report success unless `CONTACT_WEBHOOK_URL` delivery succeeded.
- Unknown `/work/[slug]` paths get a real 404 from `src/proxy.ts` — add new case-study slugs to `projects.ts` only.
