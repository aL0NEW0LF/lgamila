import type { ZodIssue } from 'zod';

import { ApiErrorCode, GenericErrorCode } from './codes';

export type ErrorCode = GenericErrorCode | ApiErrorCode;

export class BaseError extends Error {
  code: ErrorCode;
  originalError?: Error;

  constructor(
    message: string,
    code: ErrorCode,
    originalError?: Error | unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.originalError = originalError as Error;

    if (originalError instanceof Error && originalError.stack) {
      this.stack = originalError.stack;
    }
  }
}
export class HTTPError extends BaseError {
  status: number;
  response: Response;

  constructor(
    message: string,
    status: number,
    response: Response,
    originalError?: Error | unknown
  ) {
    super(message, GenericErrorCode.HTTP_ERROR, originalError);
    this.status = status;
    this.response = response;
  }
}

export class ValidationError extends BaseError {
  constructor(message: string, originalError?: Error | unknown) {
    super(message, GenericErrorCode.VALIDATION_ERROR, originalError);
  }
}

export class RuntimeError extends BaseError {
  constructor(message: string, originalError?: Error | unknown) {
    super(message, GenericErrorCode.RUNTIME_ERROR, originalError);
  }
}

export class KickApiError extends HTTPError {}

export class DatabaseError extends BaseError {
  constructor(
    message: string,
    code: GenericErrorCode = GenericErrorCode.DATABASE_ERROR,
    originalError?: Error | unknown
  ) {
    super(message, code, originalError);
  }
}

export class NotFoundError extends DatabaseError {
  constructor(message: string, originalError?: Error | unknown) {
    super(message, GenericErrorCode.NOT_FOUND, originalError);
  }
}

export class RateLimitRetriesExceededError extends BaseError {
  constructor(message: string, originalError?: Error | unknown) {
    super(message, GenericErrorCode.RATE_LIMIT_RETRIES_EXCEEDED, originalError);
  }
}

export class ApiValidationError extends BaseError {
  errors: Record<string, string[]> | ZodIssue[];
  constructor(message: string, errors: Record<string, string[]> | ZodIssue[]) {
    super(message, ApiErrorCode.VALIDATION_ERROR);
    this.name = 'ApiValidationError';
    this.errors = errors;
  }
}

export class ApiRequestError extends BaseError {
  constructor(message: string, originalError?: Error) {
    super(message, ApiErrorCode.REQUEST_ERROR, originalError);
    this.name = 'ApiRequestError';
  }
}

export class ApiResponseError extends BaseError {
  statusCode?: number;
  constructor(message: string, statusCode?: number, originalError?: Error) {
    super(message, ApiErrorCode.RESPONSE_ERROR, originalError);
    this.name = 'ApiResponseError';
    this.statusCode = statusCode;
  }
}

export class ApiNetworkError extends BaseError {
  constructor(message: string, originalError?: Error) {
    super(message, ApiErrorCode.NETWORK_ERROR, originalError);
    this.name = 'ApiNetworkError';
  }
}

export class ApiParseError extends BaseError {
  constructor(message: string, originalError?: Error) {
    super(message, ApiErrorCode.PARSE_ERROR, originalError);
    this.name = 'ApiParseError';
  }
}

export class ApiTimeoutError extends BaseError {
  constructor(message: string, originalError?: Error) {
    super(message, ApiErrorCode.TIMEOUT_ERROR, originalError);
    this.name = 'ApiTimeoutError';
  }
}

export class ApiServerError extends BaseError {
  statusCode?: number;
  constructor(message: string, statusCode?: number, originalError?: Error) {
    super(message, ApiErrorCode.SERVER_ERROR, originalError);
    this.name = 'ApiServerError';
    this.statusCode = statusCode;
  }
}

export class ApiUnauthorizedError extends BaseError {
  constructor(message = 'Unauthorized', originalError?: Error) {
    super(message, ApiErrorCode.UNAUTHORIZED_ERROR, originalError);
    this.name = 'ApiUnauthorizedError';
  }
}

export class ApiForbiddenError extends BaseError {
  constructor(message = 'Forbidden', originalError?: Error) {
    super(message, ApiErrorCode.FORBIDDEN_ERROR, originalError);
    this.name = 'ApiForbiddenError';
  }
}

export class ApiRateLimitError extends BaseError {
  constructor(message: string, originalError?: Error) {
    super(message, ApiErrorCode.RATE_LIMIT_ERROR, originalError);
    this.name = 'ApiRateLimitError';
  }
}

export class ApiRateLimitRetriesExceededError extends BaseError {
  maxRetries: number;
  originalError: Error;

  constructor(message: string, maxRetries: number, originalError: Error) {
    super(message, ApiErrorCode.RATE_LIMIT_RETRIES_EXCEEDED_ERROR);
    this.name = 'ApiRateLimitRetriesExceededError';
    this.originalError = originalError;
    this.maxRetries = maxRetries;
  }
}

export class ApiEntityNotFoundError extends BaseError {
  constructor(message: string, originalError?: Error) {
    super(message, ApiErrorCode.ENTITY_NOT_FOUND, originalError);
    this.name = 'ApiEntityNotFoundError';
  }
}
