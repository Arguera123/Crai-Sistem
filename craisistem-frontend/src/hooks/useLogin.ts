import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginService } from "../services/AuthService";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginService,
    onSuccess: (response) => {
      const token = response?.token;

      if (token) {
        localStorage.setItem("token", token);

        queryClient.invalidateQueries({ queryKey: ['whoami'] });

        navigate("/learning-center/prestamos");
        window.location.href = "/learning-center/prestamos";
      }
    },
  });
};