# Nova Learn

Personal learning dashboard for mastering Claude — Code, API, MCP, agents,
multi-LLM architecture and ops. Local-first, no backend, single user.

## Stack
Next.js 16 · TypeScript (strict) · Tailwind v4 · shadcn/ui · pnpm

## Run locally
```bash
pnpm install
pnpm dev
```
Open <http://localhost:3000>.

## Build
```bash
pnpm build
pnpm start
```

## Project layout
```
app/        # routes (App Router)
content/    # curriculum + glossary data — edit here to add learning material
types/      # domain types (curriculum vs. progress are separate)
lib/        # pure helpers (storage, progress, utils)
hooks/      # client-side hooks
components/ # ui/ from shadcn + feature folders
```

## Persistence
All progress lives in `localStorage` under `nova-learn:progress:v1`.
Export / import your progress as JSON from the Settings page.

## Status
Work in progress. The build is broken into 7 phases (scaffolding → polish);
see `CLAUDE.md` for conventions.
