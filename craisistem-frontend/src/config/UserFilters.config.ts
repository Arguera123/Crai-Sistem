import type { TFilterConfig, TUserFilters } from "../types/filters";

export const USER_FILTER_CONFIG: TFilterConfig<TUserFilters> = {

  id: {
    label: "Carnet",
    type: "text",
  },
  firstName: {
    label: "Nombre",
    type: "text",
  },
  lastName: {
    label: "Apellido",
    type: "text",
  },
  email: {
    label: "Correo",
    type: "text",
  },
  type: {
    label: "Tipo de usuario",
    type: "select",
    options: [
      { label: "Estudiante", value: "student" },
      { label: "Empleado", value: "employee" },
      { label: "Xpec", value: "xpec" },
      { label: "Lector Ocasional Privado", value: "4"},
      { label: "Lector Ocasional Público", value: "5" },
      { label: "Investigador Privado 6 Meses", value: "6"},
      { label: "Investigador Privado 1 Mes", value: "8" },
      { label: "Cortesía", value: "9" },
      { label: "Hijos de Empleados", value: "17" }
    ] 
  },
  faculty: {
    label: "Facultad",
    type: "select",
    options: [
      { label: "Ciencias Economicas y Empresariales", value: "Ciencias Economicas y Empresariales" },
      { label: "Ingeniería y Arquitectura", value: "Ingeniería y Arquitectura" },
      { label: "Ciencias Sociales y Humanidades", value: "Ciencias Sociales y Humanidades" }
    ]
  },
  state: {
    label: "Estado",
    type: "select",
    options: [
      { label: "Activo", value: "active" },
      { label: "Inactivo", value: "inactive" }
    ] 
  },
};