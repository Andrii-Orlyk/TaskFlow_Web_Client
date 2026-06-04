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

## Status

GitHub Actions CI is passing on main for:

- `npm ci`
- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build`

Not part of CI:

- `npm run check:live-api`
- `npm run test:e2e`

Local runs can verify the same deterministic gates, but the public CI status is confirmed on GitHub Actions for `main`.
