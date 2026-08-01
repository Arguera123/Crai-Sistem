// exceptions/ValidationError.ts
import { ErrorCodes } from './errorCodes';
import { HttpException } from './http.exception';

export interface FieldError {
  field: string;
  message: string;
}

export class ValidationError extends HttpException {
  readonly statusCode = 400;
  readonly errors: FieldError[];

  constructor(errors: FieldError[]) {
    super(ErrorCodes.SYSTEM.VALIDATION_ERROR);
    this.errors = errors;
  }
}