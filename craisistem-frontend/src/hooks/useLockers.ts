import { useQuery } from "@tanstack/react-query"
import { getLockersService } from "../services/LockerService"

export const useLockers = () => {
  return useQuery({
    queryKey: ["lockers"],
    queryFn: getLockersService,
    staleTime: 1000 * 10
  })
}