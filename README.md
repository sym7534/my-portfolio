# wangdynasty.ca

Personal portfolio of Ryan Wang — mechatronics engineering @ UWaterloo.

Built with Next.js (App Router), TypeScript, Tailwind CSS v4, and Motion. Deployed on Vercel.

## Development

```bash
npm install
npm run dev
```

Checks:

```bash
npx tsc --noEmit   # typecheck
npm run lint       # lint
npm run build      # production build
```

## Environment

| Variable | Purpose |
| --- | --- |
| `DISCORD_WEBHOOK_URL` | Webhook for visit pings and the message box |
| `DISCORD_MENTION_ID` | Discord user ID to @mention in notifications (optional) |
| `NEXT_PUBLIC_WEBRING_BASE_URL` | Webring base URL override (optional) |

## Structure

- `src/app` — App Router pages, API routes, SEO (robots/sitemap/OG image)
- `src/components` — sections and UI primitives
- `src/data` — all site content (edit here, not in components)
- `src/lib` — hooks and shared helpers
- `public` — static assets
