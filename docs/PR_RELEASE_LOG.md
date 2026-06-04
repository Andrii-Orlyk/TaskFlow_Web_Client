# PR Release Log

## v0.1.0 — Frontend project foundation

Status: Published in public Git history.

## v0.2.0 — Routing and layout

Status: Published in public Git history.

## v0.3.0 — API client and environment configuration

Status: Published in public Git history.

## v0.4.0 — Authentication and route guards

Status: Published in public Git history.

## v0.5.0 — Projects feature pages

Status: Published in public Git history.

## v0.6.0 — Tasks and comments feature pages

Status: Published in public Git history.

## v0.7.0 — Dashboard and UI states

Status: Published in public Git history.

## v0.8.0 — Automated tests

Status: Published in public Git history.

## v0.9.0 — CI, scripts, demo/live runtime docs

Status: Published in public Git history.

## v1.0.0 — Public portfolio release

Status: Public portfolio release.

## Verification checklist

Before public release:

```bash
npm ci
npm run typecheck
npm run lint
npm run test
npm run build
bash -n scripts/*.sh
```

Optional:

```bash
npm run test:e2e
npm run check:live-api
```
