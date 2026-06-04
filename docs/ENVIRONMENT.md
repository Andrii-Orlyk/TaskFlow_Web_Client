# Environment

## Variables

| Variable | Purpose | Example |
|---|---|---|
| `VITE_USE_MOCK_API` | Enables MSW demo/mock API in development when `true` | `true` |
| `VITE_TASKFLOW_API_BASE_URL` | Primary TaskFlow API URL | `http://localhost:5000` |
| `VITE_API_BASE_URL` | Optional generic fallback API URL | `http://localhost:5000` |
| `VITE_APP_ENV` | Optional app environment label | `development` |

## Demo mode

```env
VITE_USE_MOCK_API=true
VITE_TASKFLOW_API_BASE_URL=http://localhost:5000
```

## Live API mode

```env
VITE_USE_MOCK_API=false
VITE_TASKFLOW_API_BASE_URL=http://localhost:5000
```

## Rules

- `.env` is local and must not be committed.
- `.env.example` is committed.
- Restart the Vite dev server after changing environment variables.
