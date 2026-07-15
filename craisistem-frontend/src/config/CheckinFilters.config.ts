import type { TFilterConfig, TCheckinFilters } from "../types/filters";

export const CHECKIN_FILTER_CONFIG: TFilterConfig<TCheckinFilters> = {

  date: {
    label: "Fecha Exacta",
    type: "date",
  },
  dateFrom: {
    label: "Fecha Desde",
    type: "date",
  },
  dateTo: {
    label: "Fecha Hasta",
    type: "date",
  },
  timeFrom: {
    label: "Hora Desde",
    type: "text", 
  },
  timeTo: {
    label: "Hora Hasta",
    type: "text",
  },
  userId: {
    label: "ID de Usuario",
    type: "text",
  },
};