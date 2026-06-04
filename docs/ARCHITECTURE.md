# Architecture

## Project type

TaskFlow Web Client is a frontend-only React + TypeScript application.

The backend is the separate TaskFlow API. This repository does not contain backend implementation, database migrations, controllers, repositories, or server-side authentication.

## High-level flow

```text
browser → React routes/pages → feature components → query/mutation hooks → typed API client → TaskFlow API or MSW demo handlers
```

## Feature-first structure

Recommended structure:

```text
src/
  api/
  app/
  components/
  features/
    auth/
    projects/
    tasks/
    comments/
    dashboard/
  hooks/
  lib/
  mocks/
  pages/
  styles/
  types/
```

## API boundary

API code should stay in:

- `src/api/httpClient.ts`
- `src/api/taskFlowApi.ts`
- `src/types/api.ts`
- API-specific hooks inside feature folders if needed.

UI components should not build raw fetch requests directly.

## Server state

Use TanStack Query for server state:

- auth/current user;
- projects;
- project details;
- tasks;
- task details;
- comments;
- dashboard summary.

Mutations should invalidate/refetch related queries.

Examples:

- after project create/update/delete: projects + dashboard;
- after task create/update/delete/status update: tasks + task details + dashboard;
- after comment add/delete: comments + task details if needed.

## Routing model

Recommended route groups:

- guest: login/register;
- protected: dashboard/projects/tasks;
- public fallback: not-found.

## MSW demo architecture

When `VITE_USE_MOCK_API=true`, the app starts MSW in development before rendering React.

MSW intercepts API requests and returns deterministic demo data. The same frontend API client is used in demo and live modes.

Demo mode is for frontend review/testing without backend. Live mode remains required for real integration validation.

## UI architecture

Separate:

- layout/navigation;
- reusable UI primitives;
- feedback components for loading/empty/error states;
- feature components;
- page-level composition.

## Non-goals

- backend implementation;
- enterprise workflow engine;
- real-time collaboration;
- calendar/notification system;
- production deployment.
