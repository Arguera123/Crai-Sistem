import { query } from "express-validator";

export const checkinFiltersValidator = [
  query("date").optional().isISO8601().withMessage("Fecha inválida"),
  query("dateFrom").optional().isISO8601().withMessage("Fecha desde inválida"),
  query("dateTo").optional().isISO8601().withMessage("Fecha hasta inválida"),

  query("timeFrom").optional().matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage("Hora desde inválida"),
  query("timeTo").optional().matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage("Hora hasta inválida"),

  query("userId").optional().notEmpty().withMessage("ID de usuario vacio")
]