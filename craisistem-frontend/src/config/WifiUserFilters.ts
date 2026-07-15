import type { TFilterConfig, TWifiUserFilters } from "../types/filters";

export const WIFI_USER_FILTER_CONFIG: TFilterConfig<TWifiUserFilters> = {
  wifiUserId: {
    label: "ID Cuenta / Carnet",
    type: "text",
  },
  userId: {
    label: "ID de Usuario",
    type: "text",
  },
  librarianId: {
    label: "ID de Bibliotecario",
    type: "text",
  },
  creationDate: {
    label: "Fecha de Creación",
    type: "text", 
  },
  expirationDate: {
    label: "Fecha de Expiración",
    type: "text",
  },
};