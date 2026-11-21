import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TUserFilters } from "../types/filters";
import { getUserService, manualFetchUsersService, postRegister } from "../services/UserService";
import type { TRegisterForm } from "../types/user";
import { toast } from "react-toastify";

export const useUsers = (params: TUserFilters) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getUserService(params),
    staleTime: 1000 * 60,
    placeholderData: (previousData) => previousData,
  })
}

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TRegisterForm) => 
      postRegister(payload),
    onSuccess: () => {
      toast.success("Usuario creado correctamente");
      queryClient.invalidateQueries({
        queryKey: ['users']
      })
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.message ||
        "No se pudo crear el usuario"
      );
    }
  })
}

export const useManualFetchUsers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: manualFetchUsersService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};