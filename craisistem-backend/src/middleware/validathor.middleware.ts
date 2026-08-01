import { Request, Response, NextFunction } from "express";
import { validationResult, FieldValidationError } from "express-validator";
import { ValidationError } from "../error/validation.error"; 

export const validathor = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((_e) => {
      const err = _e as FieldValidationError;
      return {
        field: err.path,
        message: err.msg,
      };
    });

    throw new ValidationError(formattedErrors);
  }

  next();
};