# Demo Mode

## Purpose

TaskFlow Web Client is a frontend-only project. Demo mode lets a reviewer run the application without starting the TaskFlow API backend.

Demo mode must behave like a realistic frontend review environment, not like a fake production backend. It is designed for UI review, automated frontend tests, and local demonstration.

## Enable demo mode

Use `.env`:

```env
VITE_USE_MOCK_API=true
VITE_TASKFLOW_API_BASE_URL=http://localhost:5000
```

Run:

```bash
npm ci
cp .env.example .env
npm run dev
```

Or:

```bash
npm run dev:mock
```

## Demo credentials

| Role | Email | Password |
|---|---|---|
| Primary demo user | `taskflow.user@demo.dev` | `Password123!` |
| Second demo user | `taskflow.other@demo.dev` | `Password123!` |

The second user owns separate seed data so reviewers can see ownership-scoped project and task lists.

## Demo flows

The MSW demo API should support:

- sign in and sign out;
- current user loading;
- project list and project details;
- create, edit, and delete project;
- task list and task details;
- create, edit, delete, and update task status;
- task filtering by project, status, priority, and due date;
- comments list, add comment, and delete comment if the UI supports it;
- dashboard summary with projects, tasks, completed tasks, pending tasks, overdue tasks, and upcoming tasks;
- ownership-style responses such as 401, 403, and 404.

## Mock behavior rules

Demo mode should simulate frontend-facing API behavior:

- unauthorized request returns 401;
- forbidden access returns 403;
- unknown project/task/comment returns 404;
- invalid form input returns 400;
- status transition conflict returns 409 if the UI supports transition rules;
- dashboard data is calculated from mock projects/tasks or returned by a mock dashboard endpoint.

## Live mode

Live mode uses the real TaskFlow API:

```env
VITE_USE_MOCK_API=false
VITE_TASKFLOW_API_BASE_URL=http://localhost:5000
```

Run:

```bash
npm run dev:live
```

## Limitations

Demo mode does not replace final live integration testing. For a full-stack integration demo, run the client against the real TaskFlow API and verify auth, projects, tasks, comments, and dashboard flows.
