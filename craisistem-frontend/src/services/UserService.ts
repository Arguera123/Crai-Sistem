import type { AxiosResponse } from "axios"
import api from "../config/axios"
import type { TWhoamiResponse, TRegisterForm, TUserResponse, TManualFetchResponse } from "../types/user"
import type { TUserFilters } from "../types/filters"
import type { TPaginatedResponse } from "../types/pagination"

export const getUserByIdService = async (id: string) => {
  try {
    const res: AxiosResponse<TUserResponse> = await api.get(`/user/${id}`)
    return res.data
  } catch (err) {
    console.error("Error obteniendo usuario:", err)
    throw err
  }
}

export const getUserService = async (
  filters: TUserFilters
): Promise<TPaginatedResponse<TUserResponse>> => {
  try {
    const res = await api.get<TPaginatedResponse<TUserResponse>>("/user", {
      params: filters
    })

    return res.data
  } catch (err) {
    console.error("Error obtniendo users: ", err)
    throw err
  }
}

export const whoAmI = async (): Promise<TWhoamiResponse> => {
  try {
    const res = await api.get<TWhoamiResponse>("/auth/whoami")

    return res.data
  } catch (err) {
    throw err
  }
}

export const postRegister = async (
  body: TRegisterForm
) => {
  try {
    const res = await api.post('/user', body)
    return res
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const manualFetchUsersService = async (): Promise<TManualFetchResponse> => {
  try {
    const res = await api.patch<TManualFetchResponse>("/user/manual-fetch");
    return res.data;
  } catch (err) {
    console.error("Error al sincronizar usuarios manualmente:", err);
    throw err;
  }
};

export const assignRoleService = async (userId: string, role: string): Promise<void> => {
  await api.patch(`/user/${userId}/roles`, { role });
};

export const removeRoleService = async (userId: string, role: string): Promise<void> => {
  await api.delete(`/user/${userId}/roles`, { data: { role } });
};