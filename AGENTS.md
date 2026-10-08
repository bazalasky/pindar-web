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
npm test           # vitest run - one shot, this is the CI-safe one
npm run test:watch # vitest - watch mode, never exits
npm run preview    # serve the production build locally
```

`npm run dev` needs the backend running (`npm run start:dev` in `backend/`), since
`VITE_API_URL` points at `localhost:3000`.

## Current state

Vite + React 19 + TypeScript. Layout as of 2026-10-08:

```
src/api/      client.ts (the only file that attaches Authorization), types.ts (hand-written)
src/auth/     AuthContext, AuthProvider, RequireAuth, tokenStorage.ts (only localStorage caller)
src/lib/      duration.ts + duration.test.ts
src/routes/   Login, Home, NewLift
```

**React Router v8** (`react-router` - v7 merged `react-router-dom` in) and **Vitest 5** are in.
Still deliberately absent: **no data-fetching library, no state management, no form library.**
Adding any of those is a design decision that belongs in ROADMAP.md before it lands in
`package.json` - the reasoning for each deferral is recorded there, including the specific
trigger for adopting TanStack Query (a stale list after a mutation).

Two gotchas the file layout does not show. `src/api/types.ts` is maintained **by hand** and
`request<T>` is a type assertion, not a check - a wrong type there fails silently, so verify
against a real response. And the frontend is **stricter than the backend**: TypeScript 6
defaults `strict` to true and this repo sets no override, while the backend sets
`noImplicitAny: false`. Also no prettier integration here, unlike the backend.

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
