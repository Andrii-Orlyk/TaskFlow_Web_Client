# Manual and Live Test Scenarios

## Purpose

Automated frontend tests should be deterministic and should not require the live backend. Manual/live scenarios verify the real browser-to-API integration when TaskFlow API is running separately.

## Environment

Demo mode:

```env
VITE_USE_MOCK_API=true
```

Demo sign-in for manual review:

| Email | Password |
|---|---|
| `taskflow.user@demo.dev` | `Password123!` |

Live mode:

```env
VITE_USE_MOCK_API=false
VITE_TASKFLOW_API_BASE_URL=http://localhost:5000
```

## Auth scenarios

### TF-WEB-AUTH-001 — User signs in successfully

Preconditions:
- demo mode enabled or TaskFlow API running;
- user exists.

Steps:
1. Open `/login`.
2. Enter email and password.
3. Submit form.

Expected result:
- user is authenticated;
- protected navigation is visible;
- dashboard or projects route opens.

Automation status: automated plus live manual check.

### TF-WEB-AUTH-002 — Invalid credentials

Expected result:
- user sees `Invalid email or password.`;
- user remains unauthenticated.

Automation status: automated.

### TF-WEB-AUTH-003 — Backend unavailable in live mode

Expected result:
- user sees `Unable to reach the server. Check your connection and try again.`

Automation status: automated through mocked network failure; manual live check optional.

## Project scenarios

### TF-WEB-PROJ-001 — User creates a project

Expected result:
- project appears in project list;
- project details route opens or success message is shown;
- empty state disappears if this was the first project.

Automation status: automated plus demo/manual.

### TF-WEB-PROJ-002 — User edits a project

Expected result:
- updated name/description appears after save;
- project list/details cache is refreshed.

Automation status: automated or manual depending on implementation.

### TF-WEB-PROJ-003 — User deletes a project

Expected result:
- project disappears from the list;
- related task UI updates according to backend behavior.

Automation status: manual/live recommended.

## Task scenarios

### TF-WEB-TASK-001 — User creates a task inside a project

Expected result:
- task appears in task list;
- project/task counters refresh if shown.

Automation status: automated.

### TF-WEB-TASK-002 — User changes task status

Expected result:
- status badge updates;
- dashboard summary refreshes;
- invalid transition shows a business error if backend enforces transitions.

Automation status: automated plus live manual check.

### TF-WEB-TASK-003 — User filters tasks

Expected result:
- task list updates by status, priority, project, or due date filter;
- empty filtered state is clear.

Automation status: automated.

## Comment scenarios

### TF-WEB-COM-001 — User adds a comment to a task

Expected result:
- comment appears in comments list;
- comment form clears after success.

Automation status: automated or manual depending on UI scope.

### TF-WEB-COM-002 — User deletes a comment if supported

Expected result:
- comment disappears;
- no unrelated task data is changed.

Automation status: manual/live if supported.

## Dashboard scenarios

### TF-WEB-DASH-001 — Dashboard loads summary

Expected result:
- total projects, total tasks, completed tasks, pending tasks, overdue tasks, and upcoming tasks render correctly;
- loading, empty, and error states are handled.

Automation status: automated plus demo/manual.

## Ownership/security UX scenarios

### TF-WEB-SEC-001 — Unauthorized request

Expected result:
- user is redirected to sign in or sees `Please sign in to continue.`

Automation status: automated.

### TF-WEB-SEC-002 — Forbidden resource

Expected result:
- user sees `You do not have permission to perform this action.`

Automation status: automated.

### TF-WEB-SEC-003 — Missing resource

Expected result:
- user sees a clear not-found state.

Automation status: automated.
