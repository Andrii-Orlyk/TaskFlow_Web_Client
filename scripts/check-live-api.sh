#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

API_BASE="${VITE_TASKFLOW_API_BASE_URL:-${VITE_API_BASE_URL:-http://localhost:5000}}"
API_BASE="${API_BASE%/}"
EMAIL="taskflow-live-$(date +%s)@example.com"
PASSWORD="Password123!"
TOKEN=""
BACKEND_REACHABLE=0
AUTH_OK=0

printf 'TaskFlow live API check\n'
printf 'API base: %s\n' "$API_BASE"
printf 'Mode: optional manual diagnostic (CI does not require a live backend)\n'

json_field() {
  local json="$1"
  local field="$2"

  if command -v jq >/dev/null 2>&1; then
    printf '%s' "$json" | jq -r --arg field "$field" '.[$field] // empty' 2>/dev/null || true
    return
  fi

  printf '%s' "$json" | grep -o "\"${field}\"[[:space:]]*:[[:space:]]*\"[^\"]*\"" | head -n 1 | sed 's/.*:[[:space:]]*"//;s/"$//' || true
}

extract_token() {
  local json="$1"
  local token

  token="$(json_field "$json" 'token')"
  if [ -n "$token" ]; then
    printf '%s' "$token"
    return
  fi

  json_field "$json" 'accessToken'
}

print_error_hint() {
  local body="$1"
  local message

  message="$(json_field "$body" 'message')"
  if [ -n "$message" ]; then
    printf '  Error: %s\n' "$message" >&2
  fi
}

api_call() {
  local method="$1"
  local path="$2"
  local body="${3:-}"
  local token="${4:-}"
  local tmp
  local status
  local auth_args=()

  tmp="$(mktemp)"
  if [ -n "$token" ]; then
    auth_args=(-H "Authorization: Bearer $token")
  fi

  if [ -n "$body" ]; then
    status="$(
      curl -sS --connect-timeout 5 --max-time 20 \
        -o "$tmp" -w '%{http_code}' \
        -X "$method" "${API_BASE}${path}" \
        -H 'Content-Type: application/json' \
        "${auth_args[@]}" \
        -d "$body" 2>/dev/null || printf '000'
    )"
  else
    status="$(
      curl -sS --connect-timeout 5 --max-time 20 \
        -o "$tmp" -w '%{http_code}' \
        -X "$method" "${API_BASE}${path}" \
        "${auth_args[@]}" 2>/dev/null || printf '000'
    )"
  fi

  printf '%s %s -> HTTP %s\n' "$method" "$path" "$status" >&2

  if [ "$status" = "000" ]; then
    rm -f "$tmp"
    return 1
  fi

  if [ "$status" -ge 400 ]; then
    print_error_hint "$(cat "$tmp")"
  fi

  cat "$tmp"
  rm -f "$tmp"
}

printf '\nChecking API reachability...\n'
if curl -fsS --connect-timeout 5 "${API_BASE}/swagger/v1/swagger.json" >/dev/null 2>&1; then
  BACKEND_REACHABLE=1
  printf 'Swagger JSON reachable at %s/swagger/v1/swagger.json\n' "$API_BASE"
elif curl -fsS --connect-timeout 5 "${API_BASE}/health" >/dev/null 2>&1; then
  BACKEND_REACHABLE=1
  printf 'Health endpoint reachable at %s/health\n' "$API_BASE"
elif curl -fsS --connect-timeout 5 -o /dev/null "${API_BASE}/api/auth/login" 2>/dev/null; then
  BACKEND_REACHABLE=1
  printf 'Auth endpoint reachable at %s/api/auth/login\n' "$API_BASE"
else
  printf 'Backend unreachable at %s\n' "$API_BASE"
  printf 'Start TASKFLOW_API separately, then rerun: npm run check:live-api\n'
  exit 1
fi

REGISTER_BODY=$(cat <<JSON
{"email":"${EMAIL}","password":"${PASSWORD}","firstName":"Live","lastName":"Check"}
JSON
)

printf '\nAuth smoke\n' >&2
api_call POST '/api/auth/register' "$REGISTER_BODY" >/dev/null || true

LOGIN_BODY=$(cat <<JSON
{"email":"${EMAIL}","password":"${PASSWORD}"}
JSON
)

LOGIN_RESPONSE="$(api_call POST '/api/auth/login' "$LOGIN_BODY" || true)"
TOKEN="$(extract_token "$LOGIN_RESPONSE")"

if [ -n "$TOKEN" ]; then
  AUTH_OK=1
  printf 'Token received: yes (value hidden)\n'
else
  printf 'Token received: no\n'
fi

if [ "$AUTH_OK" -eq 1 ]; then
  api_call GET '/api/auth/me' '' "$TOKEN" >/dev/null || true

  printf '\nProjects smoke\n' >&2
  api_call GET '/api/projects' '' "$TOKEN" >/dev/null || true

  PROJECT_BODY='{"name":"Live API Check Project","description":"Created by check-live-api.sh"}'
  PROJECT_RESPONSE="$(api_call POST '/api/projects' "$PROJECT_BODY" "$TOKEN" || true)"
  PROJECT_ID="$(json_field "$PROJECT_RESPONSE" 'id')"

  if [ -n "$PROJECT_ID" ]; then
    api_call GET "/api/projects/${PROJECT_ID}" '' "$TOKEN" >/dev/null || true

    printf '\nTasks smoke\n' >&2
    TASK_BODY=$(cat <<JSON
{"projectId":"${PROJECT_ID}","title":"Live API Check Task","description":"Created by check-live-api.sh","priority":"Medium"}
JSON
)
    TASK_RESPONSE="$(api_call POST '/api/tasks' "$TASK_BODY" "$TOKEN" || true)"
    TASK_ID="$(json_field "$TASK_RESPONSE" 'id')"

    if [ -n "$TASK_ID" ]; then
      api_call GET "/api/tasks/${TASK_ID}" '' "$TOKEN" >/dev/null || true
      api_call PATCH "/api/tasks/${TASK_ID}/status" '{"status":"InProgress"}' "$TOKEN" >/dev/null || true
    fi
  fi

  printf '\nDashboard smoke\n' >&2
  api_call GET '/api/dashboard/summary' '' "$TOKEN" >/dev/null || true
fi

printf '\nSummary\n'
printf '- Backend reachable: %s\n' "$( [ "$BACKEND_REACHABLE" -eq 1 ] && printf yes || printf no )"
printf '- Auth flow OK: %s\n' "$( [ "$AUTH_OK" -eq 1 ] && printf yes || printf no )"
printf '- Test user email: %s\n' "$EMAIL"

if [ "$AUTH_OK" -eq 0 ]; then
  printf '\nLive API check finished with auth issues. Inspect backend logs and auth response shape.\n'
  exit 2
fi

printf '\nLive API check completed successfully.\n'
