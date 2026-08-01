import { api } from "../config/axios.config";
import { Alumno, Empleado, Xpec } from "../models/types/IExternalApi";

export const fetchAlumnos = async (): Promise<Alumno[]> => {
  try {
    const response = await api.get('/reporteSIU', { params: { reporte: 10 } });
    return response.data?.estudiantes_sia ?? [];
  } catch (err) {
    console.error("Error obteniendo Alumnos: ", err.message);
    return []; 
  }
}

export const fetchEmpleados = async (): Promise<Empleado[]> => {
  try {
    const response = await api.get('/reporteSIU', { params: { reporte: 9 } });
    return response.data?.empleados_girhux ?? [];
  } catch (err) {
    console.error("Error obteniendo Empleados: ", err.message);
    return [];
  }
}

export const fetchXpec = async (): Promise<Xpec[]> => {
  try {
    const response = await api.get('/reporteSIU', { params: { reporte: 8 } });
    return response.data?.estudiantes_pec ?? [];
  } catch (err) {
    console.error("Error obteniendo Xpec: ", err.message);
    return [];
  }
}