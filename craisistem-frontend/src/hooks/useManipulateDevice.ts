import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { TCreateDevice, TUpdateDevice } from "../types/device";
import { createDeviceService, updateDeviceService } from "../services/DeviceService";

export const useUpdateDevice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ deviceId, params }: { deviceId: number; params: TUpdateDevice }) => 
      updateDeviceService(deviceId, params),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["device"]
      });
    }
  });
};

export const useCreateDevice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (device: TCreateDevice) => 
      createDeviceService(device),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["device"]
      })
    }
  })
}