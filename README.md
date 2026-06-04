# TaskFlow Web Client

React + TypeScript frontend-only client for the TaskFlow API.

This repository demonstrates a Strong Junior frontend implementation for a practical task and project management workflow:

`auth → projects → tasks → comments → dashboard → protected routes → status workflow`

The TaskFlow API backend is a separate project. This repo contains only the frontend client, MSW demo handlers, tests, scripts, and documentation.

## What this project proves

- React + TypeScript feature-first structure
- Authentication, guest routes, and protected routes
- Projects CRUD with loading, empty, and error states
- Tasks CRUD, filters, status workflow, and overdue labels
- Task comments list, add, and delete
- Dashboard summary with status and priority breakdowns
- Typed API client with normalized HTTP and network errors
- MSW demo mode for review without a backend
- Live API mode against a separately running TaskFlow API
- Vitest component and integration tests plus Playwright demo smoke tests

## Integration modes

| Mode | When to use | Backend required |
|---|---|---|
| Demo / mock | Portfolio review and local UI testing | No — MSW with `VITE_USE_MOCK_API=true` |
| Live API | Full-stack integration with TaskFlow API | Yes — API must run separately |

## Demo credentials

| Role | Email | Password |
|---|---|---|
| Primary demo user | `taskflow.user@demo.dev` | `Password123!` |
| Second demo user (ownership examples) | `taskflow.other@demo.dev` | `Password123!` |

## Quick start (demo mode)

```bash
npm ci
cp .env.example .env
npm run dev:mock
```

Open the Vite URL, sign in with the primary demo user, then explore dashboard, projects, and tasks.

## Live API mode

Start TaskFlow API separately, then set:

```env
VITE_USE_MOCK_API=false
VITE_TASKFLOW_API_BASE_URL=http://localhost:5000
```

Run:

```bash
npm run dev:live
```

Optional scripted smoke against a running API:

```bash
npm run check:live-api
```

## Verification commands

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run test:e2e
bash -n scripts/*.sh
```

CI workflow is configured to run `npm ci`, typecheck, lint, tests, and build on GitHub Actions. It does not require the live backend. Confirm green status on your repository before claiming CI is passing.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start Vite dev server (uses `.env`) |
| `npm run dev:mock` | Start with MSW demo API (`VITE_USE_MOCK_API=true`) |
| `npm run dev:live` | Start with live API mode (`VITE_USE_MOCK_API=false`) |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |
| `npm run test` | Vitest unit and component tests |
| `npm run test:e2e` | Playwright smoke tests (demo mode web server) |
| `npm run build` | Production build |
| `npm run doctor` | Check required project files and tooling |
| `npm run clean` | Remove generated artifacts |
| `npm run check:live-api` | Optional live API smoke script (manual) |

## Documentation

| Document | Description |
|---|---|
| `docs/ARCHITECTURE.md` | Structure, routing, server state, MSW |
| `docs/API_INTEGRATION.md` | Endpoints, errors, query invalidation |
| `docs/DEMO_MODE.md` | Review without backend |
| `docs/ENVIRONMENT.md` | Environment variables |
| `docs/TESTING.md` | Automated, E2E, and live testing |
| `docs/RUNBOOK.md` | Local run and verification workflow |
| `docs/UI_UX.md` | UI states and accessibility baseline |
| `docs/CI.md` | GitHub Actions expectations |
| `docs/ROADMAP.md` | Version roadmap |
| `docs/KNOWN_LIMITATIONS.md` | Honest scope limits |
| `docs/MANUAL_TEST_SCENARIOS.md` | Manual and live test scenarios |
| `docs/REGRESSION_CHECKLIST.md` | Release regression checklist |
| `docs/PR_RELEASE_LOG.md` | Tag-oriented release notes |

## Known limitations

See `docs/KNOWN_LIMITATIONS.md`. Summary:

- Frontend only; no backend or database in this repo
- Demo mode does not replace live integration validation
- Live mode requires TaskFlow API running separately
- No production deployment, enterprise RBAC, or notifications in scope

## Not included

- Backend implementation
- Database migrations
- Production deployment
- Enterprise access control
- Production security hardening

## Portfolio scope

This is a Strong Junior frontend portfolio project focused on clean UI implementation, typed API integration, demo/live runtime strategy, deterministic tests, and public GitHub readiness.
