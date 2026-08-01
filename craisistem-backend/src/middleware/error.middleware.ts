import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../error/http.exception';
import { ErrorCodes } from '../error/errorCodes';
import { ValidationError } from '../error/validation.error'; 

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let status = 500;
  let message: string = ErrorCodes.SYSTEM.INTERNAL_ERROR.message;
  let code: string = ErrorCodes.SYSTEM.INTERNAL_ERROR.code;
  let errors: any[] | undefined = undefined; 

  if (err instanceof HttpException) {
    status = err.statusCode;
    message = err.message;
    code = err.errorCode || 'HTTP_ERROR';

    if (err instanceof ValidationError) {
      errors = err.errors;
    }
  }

  res.status(status).json({
    status,
    code,
    message,
    ...(errors ? { errors } : {}), 
    ...(process.env.NODE_ENV === 'development' && status === 500
      ? { stack: err.stack }
      : {}),
  });
};