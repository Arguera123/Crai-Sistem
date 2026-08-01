import type { TPaginatedResponse } from "../types/pagination"
import type { IDevice, TCreateDevice, TUpdateDevice } from "../types/device"
import api from "../config/axios"
import type { TDeviceFilters } from "../types/filters";

export const getActiveDeviceService = async (
  page: number,
  limit: number
): Promise<TPaginatedResponse<IDevice>> => {
  const { data } = await api.get<TPaginatedResponse<IDevice>>("/device", {
    params: {
      page,
      limit,
      state: "free"
    },
  });

  return data;
};

export const getDeviceService = async (
  params: TDeviceFilters
): Promise<TPaginatedResponse<IDevice>> => {
  const { data } = await api.get<TPaginatedResponse<IDevice>>("/device", {
    params: params
  })

  return data
}

export const updateDeviceService = async (
  deviceId: number,
  params: TUpdateDevice,
) => {
  const { data } = await api.put(`/device/${deviceId}`, params);
  return data
}

export const createDeviceService = async (
  body: TCreateDevice
) => {
  const { data } = await api.post('/device', body)
  return data
}