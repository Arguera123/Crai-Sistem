import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignWifiUser, uploadWifiUsersCSV } from "../services/WifiService";
import type { TWifiUserPayload } from "../types/wifiUser";

export const useUploadWifiCSV = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadWifiUsersCSV,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      alert("Usuarios cargados exitosamente");
    },
    onError: (error) => {
      console.error("Error al subir CSV:", error);
      alert("Error al cargar el archivo CSV");
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