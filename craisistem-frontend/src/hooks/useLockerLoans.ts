import { useQuery } from "@tanstack/react-query";
import { getLockerLoanService } from "../services/LockerLoanService";
import type { TLockerLoanFilters } from "../types/filters";

export const useLockerLoan = (params: TLockerLoanFilters) => {
  return useQuery({
    queryKey: ["locker-loan", params],
    queryFn: () => getLockerLoanService(params),
    staleTime: 1000 * 60,
  })
}