import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { TCreateDevice, TUpdateDevice } from "../types/device";
import { createDeviceService, updateDeviceService } from "../services/DeviceService";
import { toast } from "react-toastify";

const apiError = (err: any, fallback: string) =>
  err?.response?.data?.message || err?.response?.data?.errors?.[0]?.message || fallback;

export const useUpdateDevice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ deviceId, params }: { deviceId: number; params: TUpdateDevice }) => 
      updateDeviceService(deviceId, params),

    onSuccess: () => {
      toast.success("Equipo actualizado correctamente");
      queryClient.invalidateQueries({
        queryKey: ["device"]
      });
    },
    onError: (err) => { toast.error(apiError(err, "No se pudo actualizar el equipo")); }
  });
};

export const useCreateDevice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (device: TCreateDevice) => 
      createDeviceService(device),

    onSuccess: () => {
      toast.success("Equipo registrado correctamente");
      queryClient.invalidateQueries({
        queryKey: ["device"]
      })
    },
    onError: (err) => { toast.error(apiError(err, "No se pudo registrar el equipo")); }
  })
}