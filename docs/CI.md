# CI

## Purpose

GitHub Actions validates deterministic frontend quality gates without requiring TaskFlow API.

## Workflow

File: `.github/workflows/ci.yml`

Steps:

```bash
npm ci
npm run typecheck
npm run lint
npm run test
npm run build
```

## What CI does not run

- `npm run check:live-api` (optional manual live smoke)
- `npm run test:e2e` (Playwright; run locally with `npm run dev:mock` web server)

## Status wording

Before a green run is confirmed on your repository:

> CI workflow is configured to run install, typecheck, lint, tests, and build on GitHub Actions.

After `main` passes on GitHub Actions:

> GitHub Actions CI is passing on main.

Do not claim CI is passing from local runs alone.
