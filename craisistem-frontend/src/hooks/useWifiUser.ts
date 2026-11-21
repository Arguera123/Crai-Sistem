import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignWifiUser, uploadWifiUsersCSV } from "../services/WifiService";
import type { TWifiUserPayload } from "../types/wifiUser";
import { toast } from "react-toastify";

export const useUploadWifiCSV = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadWifiUsersCSV,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      toast.success(data?.message || "Usuarios cargados exitosamente");
    },
    onError: (error: any) => {
      console.error("Error al subir CSV:", error);
      toast.error(error?.response?.data?.message || "Error al cargar el archivo CSV");
    }
  });
};

export const useWifiUserAssignment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: TWifiUserPayload) => 
      assignWifiUser(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["assignments"]
      })
    }
  })
}