import type { TDeviceLoanFilters, TFilterConfig, TLoanFilters, TLockerLoanFilters } from "../types/filters";

export const LOAN_FILTER_CONFIG: TFilterConfig<TLoanFilters> = {
  date: {
    label: "Fecha exacta",
    type: "date",
  },
  dateFrom: {
    label: "Fecha desde",
    type: "date",
  },
  dateTo: {
    label: "Fecha hasta",
    type: "date",
  },
  userId: {
    label: "Carnet de Usuario",
    type: "text",
  },
  hasCharge: {
    label: "¿Entregado?",
    type: "boolean",
  },
  chargeLibrarianId: {
    label: "Bibliotecario (Cargo)",
    type: "text",
  },
  chargeTimeFrom: {
    label: "Hora cargo desde",
    type: "time",
  },
  chargeTimeTo: {
    label: "Hora cargo hasta",
    type: "time",
  },
  hasRelease: {
    label: "¿Devuelto?",
    type: "boolean",
  },
  releaseLibrarianId: {
    label: "Bibliotecario (Descargo)",
    type: "text",
  },
  releaseTimeFrom: {
    label: "Hora descargo desde",
    type: "time",
  },
  releaseTimeTo: {
    label: "Hora descargo hasta",
    type: "time",
  },
};

export const LOCKER_LOAN_FILTER_CONFIG: TFilterConfig<Omit<TLockerLoanFilters, "page" | "limit" | "order">> = {
  ...LOAN_FILTER_CONFIG, 
  lockerId: {
    label: "ID Locker",
    type: "text",
  },
};

export const DEVICE_LOAN_FILTER_CONFIG: TFilterConfig<Omit<TDeviceLoanFilters, "page" | "limit" | "order">> = {
  ...LOAN_FILTER_CONFIG,
  deviceId: {
    label: "ID Dispositivo",
    type: "text",
  },
};