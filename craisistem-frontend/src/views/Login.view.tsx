import { useState, useEffect } from "react";
import { Button, Typography } from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify"; 
import login_photo from "../assets/login_photo.png";
import logo from "../assets/logo.png";

const MicrosoftIcon = () => (
  <div className="grid grid-cols-2 gap-[2px] w-5 h-5 mr-1">
    <div className="bg-[#f25022] w-[9px] h-[9px]"></div>
    <div className="bg-[#7fba00] w-[9px] h-[9px]"></div>
    <div className="bg-[#00a4ef] w-[9px] h-[9px]"></div>
    <div className="bg-[#ffb900] w-[9px] h-[9px]"></div>
  </div>
);

function LoginView() {
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [ssoError, setSsoError] = useState<string | null>(null);

  // Redirección exitosa o seteo de error por SSO
  useEffect(() => {
    const token = searchParams.get("token");
    const errorParam = searchParams.get("error");

    if (token) {
      localStorage.setItem("token", token);
      queryClient.invalidateQueries({ queryKey: ['whoami'] });
      navigate("/learning-center/prestamos");
    }

    if (errorParam) {
      setSsoError(decodeURIComponent(errorParam));
    }
  }, [searchParams, navigate, queryClient]);

  // Manejador para disparar errores de SSO
  useEffect(() => {
    if (ssoError) {
      toast.error(ssoError, { toastId: "sso-error" });
    }
  }, [ssoError]);

  const apiBaseUrl = import.meta.env.VITE_API_URL.replace("/api/v1", "");

  const handleMicrosoftLogin = () => {
    window.location.href = `${apiBaseUrl}/api/v1/auth/microsoft`;
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      {/* Contenedor de Toastify para renderizar los toasts */}
      <ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} />

      <div className="w-1/2 flex items-center justify-center p-12 bg-[#083C6C]">
        <div className="w-full max-w-sm flex flex-col gap-6">
          <div className="flex flex-col gap-2 items-center text-center">
            <img src={logo} alt="Logo" className="w-24 mb-2" />
            <Typography variant="h4" fontWeight="800" className="text-white">
              CRAI Sistema
            </Typography>
            <Typography variant="body2" className="text-gray-300">
              Gestión de Biblioteca y Centro de Aprendizaje
            </Typography>
          </div>

          {/* BOTÓN INSTITUCIONAL DE MICROSOFT */}
          <Button
            fullWidth
            variant="outlined"
            size="large"
            startIcon={<MicrosoftIcon />}
            onClick={handleMicrosoftLogin}
            className="py-3 font-semibold rounded-lg border-white/40 text-white hover:border-white hover:bg-white/10 normal-case"
          >
            Iniciar sesión con Microsoft
          </Button>
        </div>
      </div>
      <div className="w-1/2">
        <img src={login_photo} alt="Login" className="w-full h-full object-cover" />
      </div>
    </div>
  );
}

export default LoginView;