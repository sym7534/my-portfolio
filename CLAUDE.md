# CLAUDE.md

Guidance for AI agents working in this repo.

## What this is

Ryan Wang's personal portfolio (wangdynasty.ca). Next.js App Router + TypeScript + Tailwind CSS v4, deployed on Vercel. The visual design matters: keep it identical unless explicitly asked to change it.

## Commands

- `npm run dev` — dev server
- `npx tsc --noEmit` — typecheck
- `npm run lint` — ESLint
- `npm run build` — production build (run before considering work done)

## Architecture

- `src/app/page.tsx` — server component composing the two-panel layout from section components
- `src/components/sections/` — page sections (hero, links, experience, about, projects, footer)
- `src/components/ui/` — reusable UI primitives, barrel-exported from `index.ts`
- `src/data/` — all content (projects, experience, about, socials, site strings). Content changes go here, not in components
- `src/lib/` — hooks and helpers; `src/lib/api/` holds shared route helpers (client IP, rate limiting, Discord webhook)
- `src/types/` — shared types
- `src/app/api/` — routes that post to a Discord webhook (visit ping, secret-link unlock ping, message box)

## Conventions

- Two sources of truth are a bug: render from `src/data/`, never hardcode content in components
- Keep server components server; add `"use client"` only where interactivity requires it
- Projects flagged `hidden` are only revealed via the secret recruiter subdomain (see `src/lib/useUnlock.ts`) and are not deep-linkable when locked
- Env vars: `DISCORD_WEBHOOK_URL`, `DISCORD_MENTION_ID` (see `src/lib/api/discord.ts`)
- Do not commit audio or resume reference files (see `.gitignore`)

## Gotchas

- `public/` image binaries may be managed by other tooling; avoid modifying them
- The left panel is sticky and the right panel scrolls independently (Lenis); modal scroll-locking interacts with this
- Dark mode is a blocking inline script in `layout.tsx` to avoid FOUC
