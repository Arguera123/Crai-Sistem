import { Alumno, Empleado, Xpec } from "../models/types/IExternalApi";
import { UserData } from "../models/user.entity";
import { UserStates } from "../utils/states.constant";
import { UserType } from "../utils/user-type.constants";

const parseSafeDate = (dateStr: any): Date => {
  if (!dateStr) return new Date(); 
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
};

export const UserMapper = {
  
  fromAlumno: (data: Alumno): Partial<UserData> => ({
    id: data.CARNET.trim(),
    firstName: data.NOMBRES.trim(),
    lastName: data.APELLIDO.trim(),
    email: data.EMAIL?.trim() || `${data.CARNET.trim()}@uca.edu.sv`,
    gender: data.SEXO || "N/A",
    type: UserType.STUDENT,
    faculty: String(data.DECANATO || "General"),
    expirationDate: parseSafeDate(data.EXPIRACION),
    photo: data.URLFOTO?.trim() || null,
    state: data.ELIMINADO === 0 ? UserStates.ACTIVE : UserStates.INACTIVE,
  }),

  fromEmpleado: (data: Empleado): Partial<UserData> => ({
    id: data.idusr.trim(),
    firstName: data.nombres.trim(),
    lastName: data.apellidos.trim(),
    email: data.email?.trim() || "",
    gender: data.sexo,
    type: UserType.EMPLOYEE,
    faculty: String(data.iddecanato),
    expirationDate: parseSafeDate(data.expiracion),
    photo: data.urlfoto?.trim() || null,
    state: data.eliminado === 0 ? UserStates.ACTIVE : UserStates.INACTIVE,
  }),

  fromXpec: (data: Xpec): Partial<UserData> => ({
    id: data.ID_EST.trim(),
    firstName: data.NOMBRE.trim(),
    lastName: data.APELLIDOS.trim(),
    email: data.EMAIL_PERSONAL?.trim() || "",
    gender: "N/A", 
    type: UserType.XPEC,
    faculty: data.FACULTAD || "N/A",
    expirationDate: parseSafeDate(data.FECHA_FIN_EDICION),
    photo: data.FOTO,
    state: data.ESTADO === "ACTIVO" ? UserStates.ACTIVE : UserStates.INACTIVE,
  }),
};