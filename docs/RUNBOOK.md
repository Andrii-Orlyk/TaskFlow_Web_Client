# Runbook

## Install

```bash
npm ci
```

## Demo mode without backend

```bash
cp .env.example .env
npm run dev:mock
```

Open the printed Vite URL.

Demo credentials:

| Role | Email | Password |
|---|---|---|
| Primary demo user | `taskflow.user@demo.dev` | `Password123!` |
| Second demo user | `taskflow.other@demo.dev` | `Password123!` |

## Live API mode

Start TaskFlow API separately.

Set `.env`:

```env
VITE_USE_MOCK_API=false
VITE_TASKFLOW_API_BASE_URL=http://localhost:5000
```

Run:

```bash
npm run dev:live
```

## Verify

```bash
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

## Clean artifacts

```bash
npm run clean
rm -rf node_modules dist coverage coverage-report playwright-report test-results reports
rm -f .env tsconfig.tsbuildinfo
find . -name ".DS_Store" -type f -delete
find . -type d -name "__MACOSX" -prune -exec rm -rf {} +
```
