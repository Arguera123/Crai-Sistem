import type { AxiosResponse } from "axios"
import api from "../config/axios"
import type { TWhoamiResponse, TRegisterForm, TUserResponse, TManualFetchResponse } from "../types/user"
import type { TUserFilters } from "../types/filters"
import type { TPaginatedResponse } from "../types/pagination"

export const getUserByIdService = async (id: string) => {
  const res: AxiosResponse<TUserResponse> = await api.get(`/user/${id}`)
  return res.data
}

export const getUserService = async (
  filters: TUserFilters
): Promise<TPaginatedResponse<TUserResponse>> => {
  const res = await api.get<TPaginatedResponse<TUserResponse>>("/user", {
    params: filters
  })

  return res.data
}

export const whoAmI = async (): Promise<TWhoamiResponse> => {
  const res = await api.get<TWhoamiResponse>("/auth/whoami")

  return res.data
}

export const postRegister = async (
  body: TRegisterForm
) => {
  const res = await api.post('/user', body)
  return res
}

export const manualFetchUsersService = async (): Promise<TManualFetchResponse> => {
  const res = await api.patch<TManualFetchResponse>("/user/manual-fetch");
  return res.data;
};

export const assignRoleService = async (userId: string, role: string): Promise<void> => {
  await api.patch(`/user/${userId}/roles`, { role });
};

export const removeRoleService = async (userId: string, role: string): Promise<void> => {
  await api.delete(`/user/${userId}/roles`, { data: { role } });
};