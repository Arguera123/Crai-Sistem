import api from "../config/axios";
import type { LoginResponse } from "../types/user";

export const loginService = async (email: string): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>("/auth/login", { email });

  return res.data;
};