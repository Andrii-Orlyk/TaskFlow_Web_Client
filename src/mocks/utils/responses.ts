import { HttpResponse, type JsonBodyType } from 'msw';

export function jsonResponse(body: JsonBodyType, status = 200) {
  return HttpResponse.json(body, { status });
}

export function emptyResponse(status = 204) {
  return new HttpResponse(null, { status });
}

export function errorResponse(status: number, message: string, code = 'mock_error') {
  return jsonResponse(
    {
      statusCode: status,
      code,
      message,
      errors: []
    },
    status
  );
}
