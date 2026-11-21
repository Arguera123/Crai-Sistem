import { body } from "express-validator";
import { UserType } from "../utils/user-type.constants";

export const loginValidator = [
  body("email")
    .exists().withMessage("El correo es requerido")
    .isEmail().withMessage("Correo electronico invalido"),
];

export const registerValidator = [
  body("id")
    .exists().withMessage("El id (carnet) es requerido")
    .isString().withMessage("El id debe ser texto")
    .trim()
    .isLength({ min: 1, max: 15 }).withMessage("El id debe tener entre 1 y 15 caracteres"),
  body("firstName")
    .exists().withMessage("firstName es requerido")
    .isString().trim().notEmpty().withMessage("firstName no puede estar vacio"),
  body("lastName")
    .exists().withMessage("lastName es requerido")
    .isString().trim().notEmpty().withMessage("lastName no puede estar vacio"),
  body("email")
    .exists().withMessage("El correo es requerido")
    .isEmail().withMessage("Correo electronico invalido"),
  body("gender")
    .exists().withMessage("gender es requerido")
    .isString().withMessage("gender debe ser texto"),
  body("type")
    .exists().withMessage("type es requerido")
    .isIn(Object.values(UserType)).withMessage(`type debe ser uno de: ${Object.values(UserType).join(", ")}`),
  body("expirationDate")
    .optional()
    .isISO8601().withMessage("expirationDate debe ser una fecha valida (YYYY-MM-DD)"),
];
