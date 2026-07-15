import { useMutation, useQuery } from "@tanstack/react-query"
import { getCheckinService, postCheckinService } from "../services/CheckinService";
import type { TCheckinFilters } from "../types/filters";

export const usePostCheckin = () => {
  return useMutation({
    mutationFn: (userId: string) => 
      postCheckinService(userId),
  })
}

export const useChekin = (params: TCheckinFilters) => {
  return useQuery({
    queryKey: ["checkin", params],
    queryFn: () => getCheckinService(params),
    staleTime: 1000 * 60,
    placeholderData: (previousData) => previousData,
  })
}