@AGENTS.md

# Nova Learn

Personal learning dashboard for mastering Claude (Code, API, MCP, agents,
architecture). Single-user, local-first. No auth, no DB, no backend.
The repo is public on GitHub and serves as portfolio — code quality bar is high.

## Stack
- Next.js 16 (App Router). This version differs from the Next.js most training
  data covers — read `node_modules/next/dist/docs/` before assuming behaviour.
- TypeScript with `strict: true`. No `any`. No `@ts-ignore` without a one-line
  comment justifying the suppression.
- Tailwind v4 + shadcn/ui (preset `base-nova`, base color `zinc`, components
  built on Base UI not Radix).
- Lucide React for icons.
- Geist Sans / Geist Mono.
- pnpm. Node 20+.

## Architecture
- `app/` — routes (App Router). Server Components by default. Add `'use client'`
  only when state, effects or browser APIs are needed.
- `content/` — static curriculum data (`curriculum.ts`) and glossary
  (`glossary.ts`). Components must NEVER hardcode learning content.
- `types/` — domain types. Curriculum and Progress are deliberately split:
  `types/curriculum.ts` is static content; `types/progress.ts` is user state.
- `lib/` — pure helpers (storage, progress maths, utils). No React.
- `hooks/` — client hooks (`'use client'`).
- `components/` — `ui/` from shadcn, plus feature folders (`layout/`,
  `progress/`, `session/`).

## Persistence
All user state lives in `localStorage` under key `nova-learn:progress:v1`.
The `Progress` type carries a `schemaVersion`. Bump it and write a migration if
the shape changes. `lib/storage.ts` is the only module allowed to touch
`window.localStorage` directly.

## Data model rule
Static curriculum NEVER carries user state. No `mastered`, `status`, `notes`
or `completedAt` fields on `Module`/`Session`/`Concept`/`Exercise`. User state
is keyed by id inside `Progress`.

## Styling
- Use Tailwind tokens (`bg-primary`, `text-muted-foreground`, `border-border`)
  rather than raw colours. The CSS variables in `app/globals.css` are the
  single source of truth.
- Spacing follows a 4/8 system. Don't pair `p-3` with `p-5` on visually
  similar elements.
- Cap text sizes per view at three.
- Light/dark must both work for every screen.

## Anti-patterns to refuse
- Adding a dependency without a clear reason. Each dep is debt.
- `<img>` raw tags — use `next/image`.
- Inline hex/rgb colours in component code.
- "Just in case" features that aren't in the spec.
- Tests for this scope (no Vitest/Jest — explicitly out of scope).
- Auth, DB, or sync — all explicitly out of scope.

## Workflow
The build is broken into 7 phases. Each phase ends with a commit and waits
for OK before the next phase begins.
