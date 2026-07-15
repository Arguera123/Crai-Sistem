import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { chargeLockerLoanService, getActiveLockerLoansService, releaseLockerLoanService } from "../services/LockerLoanService"
import type { IChargeLoanPayload } from "../types/loan"

export const useActiveLockerLoans = () => {
  return useQuery({
    queryKey: ["active-locker-loans"],
    queryFn: getActiveLockerLoansService,
    staleTime: 1000 * 10
  })
}

export const useLockerLoanCharge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: IChargeLoanPayload) => 
      chargeLockerLoanService(payload),
    
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["active-locker-loans"]
      });
      queryClient.invalidateQueries({
        queryKey: ["lockers"],
      })
    }
  })
}

export const useLockerLoanRelease = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => releaseLockerLoanService(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["active-locker-loans"],
      });
      queryClient.invalidateQueries({
        queryKey: ["lockers"],
      })
    }
  })
}