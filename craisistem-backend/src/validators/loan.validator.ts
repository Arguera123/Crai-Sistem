import { body, query } from "express-validator";

export const createLoanValidator = [
  body("userId")
    .exists().withMessage("userId es requerido")
    .isString().withMessage("userId debe ser texto")
    .trim()
    .notEmpty().withMessage("userId no puede estar vacio"),
  body("resourceId")
    .exists().withMessage("resourceId es requerido")
    .isInt({ min: 1 }).withMessage("resourceId debe ser un numero entero"),
];

export const wifiAssignValidator = [
  body("userId")
    .exists().withMessage("userId es requerido")
    .isString().withMessage("userId debe ser texto")
    .trim()
    .notEmpty().withMessage("userId no puede estar vacio"),
  body("wifiUserId")
    .exists().withMessage("wifiUserId es requerido")
    .isString().withMessage("wifiUserId debe ser texto")
    .trim()
    .notEmpty().withMessage("wifiUserId no puede estar vacio"),
];

const allowedOrderFields = [
  "date",
  "user",
  "device",
  "locker",
  "chargeTime",
  "releaseTime",
];

const commonLoanFiltersValidator = [
  query("date").optional().isISO8601().withMessage("Fecha inválida"),
  query("dateFrom").optional().isISO8601().withMessage("Fecha desde inválida"),
  query("dateTo").optional().isISO8601().withMessage("Fecha hasta inválida"),

  query("userId").optional().notEmpty().withMessage("ID de usuario vacio"),

  query("hasCharge")
    .optional()
    .isBoolean()
    .withMessage("hasCharge debe ser true o false"),
  query("hasRelease")
    .optional()
    .isBoolean()
    .withMessage("hasRelease debe ser true o false"),

  query("chargeLibrarianId")
    .optional()
    .notEmpty()
    .withMessage("ID de bibliotecario (carga) inválido"),
  query("releaseLibrarianId")
    .optional()
    .notEmpty()
    .withMessage("ID de bibliotecario (liberación) inválido"),

  query("chargeTimeFrom")
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Hora de carga desde inválida"),
  query("chargeTimeTo")
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Hora de carga hasta inválida"),

  query("releaseTimeFrom")
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Hora de liberación desde inválida"),
  query("releaseTimeTo")
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Hora de liberación hasta inválida"),

  query("order")
    .optional()
    .custom((value) => {
      const fields = value.split(",");
      for (const field of fields) {
        const key = field.startsWith("-") ? field.slice(1) : field;
        if (!allowedOrderFields.includes(key)) {
          throw new Error(`Campo de orden inválido: ${key}`);
        }
      }
      return true;
    }),
];

export const deviceLoanFiltersValidator = [
  ...commonLoanFiltersValidator,
  query("deviceId")
    .optional()
    .isNumeric()
    .withMessage("ID de computadora inválido"),
];

export const lockerLoanFiltersValidator = [
  ...commonLoanFiltersValidator,
  query("lockerId")
    .optional()
    .isNumeric()
    .withMessage("ID de casillero inválido"),
];
