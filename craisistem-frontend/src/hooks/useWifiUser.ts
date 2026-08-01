import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { assignWifiUser, uploadWifiUsersCSV } from "../services/WifiService";
import type { TWifiUserPayload } from "../types/wifiUser";

export const useUploadWifiCSV = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadWifiUsersCSV,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      toast.success("Usuarios cargados exitosamente");
    },
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