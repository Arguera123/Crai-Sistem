import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { chargeDeviceLoanService, getActiveDeviceLoansService, releaseDeviceLoanService } from "../services/DeviceLoanService";
import type { IChargeLoanPayload } from "../types/loan";

export const useActiveDeviceLoans = () => {
  return useQuery({
    queryKey: ["active-device-loans"],
    queryFn: getActiveDeviceLoansService,
    staleTime: 1000 * 10,
  });
};

export const useDeviceLoanCharge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: IChargeLoanPayload) =>
      chargeDeviceLoanService(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["active-device-loans"],
      });
      queryClient.invalidateQueries({
        queryKey: ["active-devices"],
      })
    },
  });
};

export const useDeviceLoanRelease = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => releaseDeviceLoanService(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["active-device-loans"],
      });
      queryClient.invalidateQueries({
        queryKey: ["active-devices"],
      })
    },
  });
};


