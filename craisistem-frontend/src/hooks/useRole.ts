import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignRoleService, removeRoleService } from "../services/UserService";

export const useUserRoles = () => {
  const queryClient = useQueryClient();

  const assignRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      assignRoleService(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const removeRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      removeRoleService(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return {
    assignRole: assignRoleMutation.mutate,
    removeRole: removeRoleMutation.mutate,
    isLoading: assignRoleMutation.isPending || removeRoleMutation.isPending
  };
};