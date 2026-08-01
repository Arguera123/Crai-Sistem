import { body, query } from "express-validator";
import { Roles } from "../utils/roles.constant";
import { UserStates } from "../utils/states.constant";

export const roleActionValidator = [
  body("role")
    .exists().withMessage("El campo 'role' es requerido")
    .isString().withMessage("El rol debe ser un texto")
    .trim()
    .custom((value) => {
      if (!Object.values(Roles).includes(value as Roles)) {
        throw new Error(`Rol inválido: ${value}`);
      }
      return true;
    }),
];

export const allowedUserOrderFields = [
  "id",
  "firstName",
  "lastName",
  "email",
  "type",
  "faculty",
  "active",
];

export const userFiltersValidator = [
  query("id").optional().notEmpty().withMessage("El ID no puede estar vacío"),

  query("firstName")
    .optional()
    .isString()
    .withMessage("El nombre debe ser texto"),

  query("lastName")
    .optional()
    .isString()
    .withMessage("El apellido debe ser texto"),

  query("email")
    .optional()
    .isEmail()
    .withMessage("Correo electrónico inválido"),

  query("type").optional().isString().withMessage("El tipo debe ser texto"),

  query("faculty")
    .optional()
    .isString()
    .withMessage("La facultad debe ser texto"),

  query("state")
    .optional()
    .isString()
    .custom((value) => {
      if (!Object.values(UserStates).includes(value)) {
        throw new Error(`Estado invalido: ${value}`);
      }
      return true;
    }),

  query("order")
    .optional()
    .custom((value) => {
      const fields = value.split(",");
      for (const field of fields) {
        const key = field.startsWith("-") ? field.slice(1) : field;
        if (!allowedUserOrderFields.includes(key)) {
          throw new Error(`Campo de orden inválido: ${key}`);
        }
      }
      return true;
    }),
];
