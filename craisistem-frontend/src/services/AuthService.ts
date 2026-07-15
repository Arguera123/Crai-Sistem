import api from "../config/axios";
import type { LoginResponse } from "../types/user";

export const loginService = async (email: string): Promise<LoginResponse> => {
  try {
    const res = await api.post<LoginResponse>("/auth/login", {
      email: email
    })
    
    return res.data;
  } catch (err) {
    console.error("Error de login", err);
    throw err;
  }
}