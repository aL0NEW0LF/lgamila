export class BaseError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.name = "BaseError";
    this.code = code;
  }
}
