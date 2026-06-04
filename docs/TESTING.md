# Testing

## Deterministic checks

These checks run without the live backend:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
bash -n scripts/*.sh
```

The Vitest suite covers:

- API client URL joining, auth header, JSON parsing, and HTTP/network error mapping;
- auth forms, route guards, and logout;
- projects, tasks, comments, and dashboard UI flows with mocked fetch;
- MSW demo API behavior through `msw/node` handlers.

## E2E smoke

```bash
npm run test:e2e
```

Playwright starts `npm run dev:mock` and runs demo-mode smoke tests for:

- home and login pages;
- guest redirect from protected routes;
- demo login;
- projects, tasks, and dashboard navigation with seeded MSW data.

Live browser E2E against a real API is optional. Set `E2E_LIVE_API=true` only when TaskFlow API is running and you extend `tests/e2e/live.spec.ts`. Otherwise that suite stays skipped.

## Demo mode tests

MSW-backed tests validate:

- demo login and current user;
- scoped project list;
- task status mutation in mock state;
- comments on a task;
- dashboard summary;
- invalid credentials and duplicate registration responses.

## Live/manual tests

Live checks require TaskFlow API running separately.

Scripted smoke:

```bash
npm run check:live-api
```

Manual scenarios are listed in `docs/MANUAL_TEST_SCENARIOS.md`.

## CI

GitHub Actions runs install, typecheck, lint, Vitest, and build. It does not require the live backend.

Playwright E2E is intended for local verification or a future CI step once browser dependencies are added to the workflow. Do not claim CI is green until the workflow passes on your repository.
