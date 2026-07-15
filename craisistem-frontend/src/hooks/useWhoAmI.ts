import { useQuery } from "@tanstack/react-query";
import { whoAmI } from "../services/UserService";

export const useWhoAmI = () => {
  const token = localStorage.getItem("token");
  
  return useQuery({
    queryKey: ['whoami'],
    queryFn: whoAmI,
    enabled: !!token,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};