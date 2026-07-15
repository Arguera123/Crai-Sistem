import { useQuery } from "@tanstack/react-query"
import { getActiveDeviceService, getDeviceService } from "../services/DeviceService"
import type { TDeviceFilters } from "../types/filters"

export const useDevice = (filters: TDeviceFilters) => {
  return useQuery({
    queryKey: ['device', filters],
    queryFn: () => getDeviceService(filters),
    placeholderData: (previousData) => previousData,
    staleTime: 0
  })
}

export const useActiveDevice = (page: number, limit: number) => {
  return useQuery({
    queryKey: ['active-devices'],
    queryFn: () => getActiveDeviceService(page, limit),
    staleTime: 1000 * 60 * 5,
  })
}