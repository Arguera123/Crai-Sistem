import { Request, Response, NextFunction, RequestHandler } from "express";
import { validationResult, FieldValidationError } from "express-validator";

export const validathor = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  // ! Bad Request
  if (!errors.isEmpty()) {
    res.status(400).json({
      // Solo el primer error de cada campo, para no repetir mensajes
      errors: errors.array({ onlyFirstError: true }).map((_e: FieldValidationError) => ({
        field: _e.path,
        message: _e.msg,
      })),
    });
    return;
  }

  next()
};
