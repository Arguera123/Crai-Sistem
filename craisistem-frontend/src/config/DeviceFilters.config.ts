import type { TFilterConfig } from "../types/filters";
import type { TDeviceFilters } from "../types/filters"; // Ajusta la ruta a donde tengas el type

export const DEVICE_FILTER_CONFIG: TFilterConfig<TDeviceFilters> = {
  id: {
    label: "ID Dispositivo",
    type: "text", // Usamos text para que el debounce sea más fluido
  },
  inventary: {
    label: "N° Inventario",
    type: "text",
  },
  brand: {
    label: "Marca",
    type: "text",
  },
  model: {
    label: "Modelo",
    type: "text",
  },
  section: {
    label: "Sección / Ubicación",
    type: "text",
  },
  operatingSystem: {
    label: "Sistema Operativo",
    type: "select",
    options: [
      { label: "Windows", value: "windows" },
      { label: "macOS", value: "mac" },
      { label: "Linux", value: "linux" },
    ],
  },
  state: {
    label: "Estado",
    type: "select",
    options: [
      { label: "Disponible", value: "free" },
      { label: "Ocupado", value: "occupied" },
    ],
  },
};