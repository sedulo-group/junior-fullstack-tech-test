# Taskroom

A small full-stack task tracker for a junior developer interview. Three pages, a real HTTP API, plain React hooks, and Chakra UI styling. The single interface mixes polished UI with deliberate usability mistakes and one code defect for the candidate to investigate. Start with a browser walkthrough, then move into a small change. Interviewer spoilers are in `INTERVIEW.md`.

## Run it

Use **Node.js 24 LTS or newer** and npm. No database, account, API key, or environment file is needed.

```sh
git clone https://github.com/sedulo-group/junior-fullstack-tech-test.git
cd junior-fullstack-tech-test
npm ci
npm run dev
```

- Frontend: http://localhost:3000
- NestJS API: http://127.0.0.1:4000/tasks
- Stop both with `Ctrl+C`.

The API starts with three sample tasks. **Data lives in memory and resets when the API restarts**, including a restart after editing backend code. Browser refreshes keep data while the API stays running. There is no authentication: this is a local interview exercise, not a production service. The API binds to loopback by default.

If a port is already in use, stop the other app or run the services separately:

```sh
# Terminal 1
npm run build -w apps/api
PORT=4001 npm run dev -w apps/api

# Terminal 2
API_URL=http://127.0.0.1:4001 npm run dev -w apps/web -- --port 3001
```

For Windows PowerShell, set environment variables with `$env:PORT="4001"` and `$env:API_URL="http://127.0.0.1:4001"` before the corresponding commands. The default `npm run dev` works without environment variables on all platforms.

## The three pages

1. **`/tasks`** — task cards, title search, status filter, and a completion count.
2. **`/tasks/new`** — controlled title/description fields, validation, submit state, and navigation after saving.
3. **`/tasks/[id]`** — load one task, change its status, and delete it with confirmation.

`/` redirects to `/tasks`.

## Where to start reading

```text
apps/web/src/
  app/layout.tsx                 Shared layout and provider
  app/tasks/page.tsx             List, local state and derived filtering
  app/tasks/new/page.tsx         Controlled form, useRef and useRouter
  app/tasks/[id]/page.tsx        Route params, effect and mutations
  components/app-shell.tsx      Navigation and responsive Chakra styles
  components/task-card.tsx      A small component with typed props
  components/task-summary.tsx   Derived counts by status
  components/status-badge.tsx   Status-to-colour mapping
  components/page-feedback.tsx Loading and error visuals
  hooks/use-tasks.ts             Custom hook, fetching and effect cleanup
  lib/api.ts                    fetch wrapper and HTTP methods
  lib/tasks.ts                  Frontend types and labels
apps/api/src/
  main.ts                       Starts the HTTP server
  app.ts                        Creates the app and validation pipe
  app.module.ts                 Registers the controller and service
  tasks/tasks.controller.ts     Routes, parameters and request bodies
  tasks/tasks.service.ts        The in-memory task array
  tasks/task.dto.ts             Runtime input validation
  tasks/task.ts                 Backend model
```

A browser request to `/api/tasks` is forwarded by `apps/web/next.config.ts` to NestJS at `/tasks`. The controller validates the body, the service changes its array, and the frontend updates from the response. No state library, ORM, authentication flow, or shared-package build is involved.

The small frontend/backend types are intentionally explicit on each side. Keeping a contract in sync is a useful discussion point; a generated client would add machinery to this exercise.

## Versions

Latest stable releases resolved from npm on **22 September 2026**, with exact direct dependency versions and `package-lock.json` committed:

| Package | Version |
| --- | --- |
| Next.js | 16.3.5 |
| React / React DOM | 19.3.0 |
| NestJS | 12.0.4 |
| Chakra UI (v3) | 3.37.0 |
| TypeScript | 7.0.2 |

The app uses the App Router. Interactive components use `"use client"`; the root layout remains a server component. Chakra uses `defaultSystem` and style props. The `--webpack` flag follows [Chakra's Next.js guidance](https://chakra-ui.com/docs/get-started/frameworks/next-app) about Emotion hydration with Turbopack. See also the [NestJS migration guide](https://docs.nestjs.com/migration-guide) and [Next.js release notes](https://nextjs.org/blog).

## API

| Method | Route | Body / result |
| --- | --- | --- |
| GET | `/tasks` | All tasks |
| GET | `/tasks/:id` | One task, or 404 |
| POST | `/tasks` | `{ "title": "Read the code", "description": "" }`; returns 201 |
| PATCH | `/tasks/:id` | `{ "status": "done" }`; returns the updated task |
| DELETE | `/tasks/:id` | Returns 204 with no body |

Statuses: `todo`, `in-progress`, `done`. Title: 1–80 characters after trimming. Description: a string up to 500 characters; use `""` when empty. Unexpected body fields are rejected. Invalid bodies return 400; unknown task IDs return 404.

## Check it

```sh
npm run check                  # Lint, typecheck, API tests, production builds
npx playwright install chromium
npm run test:e2e                # Browser tests; starts its own servers on 3217/4217
```

The API tests use Node's built-in test runner against a real Nest HTTP server. Playwright covers the complete task lifecycle, filtering, loading/error/empty states, retries, failed writes, missing tasks, navigation, mobile overflow, and browser console errors. GitHub Actions runs both commands on Node 24. One additional search regression in `tests/search.spec.ts` is marked as an **expected failure** for the intentional code defect. Its assertions describe the correct behaviour. After fixing the bug, remove `test.fail` so it becomes an ordinary passing regression test; an unexpected pass makes CI fail until the marker is removed.

For a production-mode local smoke test, run `npm run build`, then `npm run start -w apps/api` and `npm run start -w apps/web` in separate terminals.

## Interview session

Open [INTERVIEW.md](./INTERVIEW.md) for a short code walkthrough, discussion prompts, and small live-coding exercises. Pick one exercise to match the time available.
