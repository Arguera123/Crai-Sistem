import { body, param, query } from "express-validator";

export const idInParamsValidator = [
  param('identifier')
    .notEmpty().withMessage('Identifier es requerido')
    .isUUID().withMessage('Identifier debe ser un UUID')
]

export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('page debe ser un numero entero mayor o igual a 1'),
  query('limit')
    .optional()
    .isInt({ min: 10 })
    .withMessage('limit debe ser un número entero entre 1 y 100')
]