# Regression Checklist

## Purpose

This checklist separates deterministic automated checks, demo-mode review, and live API validation.

## Automated checks

| Area | Check | Status |
|---|---|---|
| Tooling | `npm run typecheck` | Required |
| Tooling | `npm run lint` | Required |
| Tests | `npm run test` | Required |
| Build | `npm run build` | Required |
| Scripts | `bash -n scripts/*.sh` | Required |
| E2E | `npm run test:e2e` (demo mode; live suite skipped unless `E2E_LIVE_API=true`) | Required locally before release |

## Feature regression

| Area | Scenario | Coverage target |
|---|---|---|
| Auth | login, register, logout, current user | Automated + demo |
| Routes | protected, guest, not found | Automated |
| Projects | list, details, create, edit, delete | Automated + demo/live |
| Tasks | list, details, create, edit, delete | Automated + demo/live |
| Status | task status update and invalid transition message | Automated + demo/live |
| Filters | status, priority, project, due date | Automated |
| Comments | list, add, delete if supported | Automated + manual |
| Dashboard | summary cards, overdue/upcoming tasks | Automated + demo/live |
| Errors | 400, 401, 403, 404, 409, 500, network | Automated |
| UI states | loading, empty, error, success | Automated + manual |
| Responsive | desktop and mobile layout | Manual |
| Accessibility | labels, keyboard basics, visible errors | Manual + automated where practical |

## Live API validation

Before final reviewer validation, run TaskFlow API separately and verify:

- register/login works against live API;
- current user endpoint works;
- projects are loaded from live API;
- task creation and status updates persist;
- comments persist if supported;
- dashboard reflects live data;
- unauthorized/forbidden/not-found states are displayed correctly.
