import { useQuery } from "@tanstack/react-query"
import { getDeviceLoanService } from "../services/DeviceLoanService"
import type { TDeviceLoanFilters } from "../types/filters"

export const useDeviceLoan = (params: TDeviceLoanFilters) => {
  return useQuery({
    queryKey: ["device-loan", params],
    queryFn: () => getDeviceLoanService(params),
    staleTime: 1000 * 60
  })
}