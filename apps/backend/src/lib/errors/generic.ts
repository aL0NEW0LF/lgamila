import { GenericErrorCode } from "./codes";

export class BaseError extends Error {
  code: string;
  constructor(message = "Unknown error", code: string) {
    super(message);
    this.code = code;
  }
}

export class UnknownError extends BaseError {
  constructor(message = "Unknown error") {
    super(message, GenericErrorCode.UNKNOWN_ERROR);
  }
}

export class ValidationError extends BaseError {
  constructor(message = "Validation failed") {
    super(message, GenericErrorCode.VALIDATION_ERROR);
  }
}
