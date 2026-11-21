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

        navigate("/");
        window.location.href = "/";
        
        console.log("Login exitoso y navegación iniciada");
      } else {
        console.error("Login exitoso pero no se encontró el token en la respuesta");
      }
    },
    onError: (error) => {
      console.error("Error en la mutación de login:", error);
    }
  });
};