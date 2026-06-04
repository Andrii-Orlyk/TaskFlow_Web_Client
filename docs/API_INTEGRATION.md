# API Integration

## Boundary

This repository is a frontend client. The TaskFlow API is a separate backend system.

Frontend responsibilities:

- build typed API requests;
- handle responses and errors;
- manage auth token in the browser;
- display loading, empty, success, and error states;
- invalidate/refetch queries after mutations;
- provide demo/mock mode for frontend review without backend.

Backend responsibilities:

- authenticate users;
- enforce ownership;
- persist projects, tasks, and comments;
- validate business rules;
- return correct HTTP statuses.

## Environment

Primary backend URL:

```env
VITE_TASKFLOW_API_BASE_URL=http://localhost:5000
```

Fallback if supported:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Demo mode:

```env
VITE_USE_MOCK_API=true
```

Live mode:

```env
VITE_USE_MOCK_API=false
```

## Endpoint groups

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

Projects:

- `GET /api/projects`
- `GET /api/projects/{id}`
- `POST /api/projects`
- `PUT /api/projects/{id}`
- `DELETE /api/projects/{id}`

Tasks:

- `GET /api/tasks`
- `GET /api/tasks/{id}`
- `POST /api/tasks`
- `PUT /api/tasks/{id}`
- `PATCH /api/tasks/{id}/status`
- `DELETE /api/tasks/{id}`

Comments:

- `GET /api/tasks/{taskId}/comments`
- `POST /api/tasks/{taskId}/comments`
- `DELETE /api/comments/{id}` if supported by backend/API client.

Dashboard:

- `GET /api/dashboard/summary`

## Error mapping

| Status | Frontend message |
|---|---|
| 400 | Please check the entered data. |
| 401 | Please sign in to continue. |
| 403 | You do not have permission to perform this action. |
| 404 | The requested resource was not found. |
| 409 | Business-specific message when provided by the API |
| 500 | Server error. Please try again later. |
| Network | Unable to reach the server. Check your connection and try again. |

## Query invalidation

After project mutation:

- invalidate project list;
- invalidate project details;
- invalidate dashboard.

After task mutation/status update:

- invalidate task list;
- invalidate task details;
- invalidate project details if task counts are displayed;
- invalidate dashboard.

After comment mutation:

- invalidate task comments;
- invalidate task details if comment count is displayed.

## Demo vs live

Demo mode uses MSW handlers and deterministic fake data. It is for frontend review and tests.

Live mode uses the real TaskFlow API. It is required for final fullstack integration validation.
