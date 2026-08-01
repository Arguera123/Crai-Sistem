import api from "../config/axios";
import type { TPaginatedResponse } from "../types/pagination";
import type { TWifiUserResponse } from "../types/wifiUser";

export const getAssignmentsService = async (
  filters: any
): Promise<TPaginatedResponse<TWifiUserResponse>> => {
  const { data } = await api.get<TPaginatedResponse<TWifiUserResponse>>("/wifi-user", {
    params: filters,
  });

  return data;
};