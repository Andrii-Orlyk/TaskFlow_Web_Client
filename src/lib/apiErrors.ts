export type ApiErrorKind =
  | 'validation'
  | 'auth'
  | 'forbidden'
  | 'notFound'
  | 'conflict'
  | 'server'
  | 'network'
  | 'unknown';

export type ApiClientErrorShape = {
  status?: number;
  code?: string;
  message: string;
  kind: ApiErrorKind;
};

export class ApiClientError extends Error implements ApiClientErrorShape {
  status?: number;
  code?: string;
  kind: ApiErrorKind;

  constructor({ status, code, message, kind }: ApiClientErrorShape) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
    this.kind = kind;
  }
}

type BackendErrorPayload = {
  statusCode?: number;
  code?: string;
  message?: string;
  errors?: string[];
};

function readBackendMessage(payload: unknown): { code?: string; message?: string } {
  if (!payload || typeof payload !== 'object') {
    return {};
  }

  const body = payload as BackendErrorPayload;
  const validationMessage = body.errors?.filter(Boolean).join(' ');
  return {
    code: body.code,
    message: body.message ?? validationMessage
  };
}

export function mapHttpError(status: number, payload: unknown): ApiClientError {
  const { code, message } = readBackendMessage(payload);

  if (status === 400) {
    return new ApiClientError({
      status,
      code,
      kind: 'validation',
      message: message ?? 'Please check the entered data.'
    });
  }

  if (status === 401) {
    return new ApiClientError({
      status,
      code,
      kind: 'auth',
      message: message ?? 'Please sign in to continue.'
    });
  }

  if (status === 403) {
    return new ApiClientError({
      status,
      code,
      kind: 'forbidden',
      message: message ?? 'You do not have permission to perform this action.'
    });
  }

  if (status === 404) {
    return new ApiClientError({
      status,
      code,
      kind: 'notFound',
      message: message ?? 'The requested resource was not found.'
    });
  }

  if (status === 409) {
    return new ApiClientError({
      status,
      code,
      kind: 'conflict',
      message: message ?? 'This action could not be completed because of a conflict.'
    });
  }

  if (status >= 500) {
    return new ApiClientError({
      status,
      code,
      kind: 'server',
      message: message ?? 'Server error. Please try again later.'
    });
  }

  return new ApiClientError({
    status,
    code,
    kind: 'unknown',
    message: message ?? 'Something went wrong. Please try again.'
  });
}

export function mapNetworkError(): ApiClientError {
  return new ApiClientError({
    kind: 'network',
    message: 'Unable to reach the server. Check your connection and try again.'
  });
}
