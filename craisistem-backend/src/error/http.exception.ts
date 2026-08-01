export abstract class HttpException extends Error {
  abstract readonly statusCode: number;
  readonly errorCode?: string;

  constructor(errorConfig: { message: string; code?: string }) {
    super(errorConfig.message);
    this.errorCode = errorConfig.code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}