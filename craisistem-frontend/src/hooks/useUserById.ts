import { useQuery } from "@tanstack/react-query"
import { getUserByIdService } from "../services/UserService"

export const useUserById = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => getUserByIdService(id),
    enabled: id.length >= 8,
    staleTime: 1000 * 60
  })
}