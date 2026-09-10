# AGENTS.md - pindar-web

Repo-specific guidance for AI coding agents. Deliberately short: this repo is still Phase 0.

**If this repo is checked out inside the Pindar workspace,** the root `AGENTS.md` and
`ROADMAP.md` one level up carry the full project context - working mode, API shape, and the
phase-by-phase design record. Read those first; they win on anything this file doesn't cover.

## Working mode

Pindar is a **mentorship project**. The user writes all implementation code themselves. Give
concept + constraints + acceptance criteria before code is written; review pasted code
afterward like a senior engineer doing a PR review. If asked to "just write it," push back once
and confirm.

The user's frontend background is Vue - **Vue/Pinia analogies land well** when explaining React
concepts. Explain with examples from outside this project, one concept at a time, and ask for a
teach-back before moving on.

## Commands

```bash
npm run dev        # vite, port 5173
npm run build      # tsc -b && vite build - typecheck runs as part of build
npm run lint       # eslint . (no --fix, unlike the backend)
npm run preview    # serve the production build locally
```

## Current state

Vite + React 19 + TypeScript. `src/` is the unmodified Vite template plus a hello-world fetch
against the API - `App.tsx`, `main.tsx`, two CSS files.

**No router, no data-fetching library, no state management, no test runner yet.** Adding any of
those is a design decision that belongs in ROADMAP.md before it lands in `package.json`.

## Talking to the API

The backend is `pindar-api` (NestJS), deployed at https://pindar-api.onrender.com, local on
port 3000. Auth is a single-owner JWT with 7-day expiry; there is no public `/register`.

Two things that will bite when rendering API responses:

- **`Decimal` fields serialize as strings, not numbers.** Weight comes back as `"225.5"`.
  Don't assume arithmetic works without converting.
- **Date-only fields are UTC midnight.** Formatting them with local-time methods renders the
  previous day for anyone west of UTC.

## Deployment

Vercel - https://pindar-web.vercel.app. `README.md` is unmodified Vite scaffold; nothing
project-specific is in it.
