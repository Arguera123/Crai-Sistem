import { useState, useRef, useEffect } from "react";
import { 
  Box, Container, Paper, TextField, Typography, Avatar, 
  Fade, Stack, InputAdornment, CircularProgress 
} from "@mui/material";
import BadgeIcon from '@mui/icons-material/Badge';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { toast } from "react-toastify";
import { usePostCheckin } from "../hooks/useCheckin";

export function StudentCheckinRegisterView() {
  const [carnet, setCarnet] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { 
    mutateAsync: postCheckin, 
    data: response, 
    isPending, 
    reset 
  } = usePostCheckin();

  useEffect(() => {
    const forceFocus = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    forceFocus();
    document.addEventListener("click", forceFocus);
    
    return () => document.removeEventListener("click", forceFocus);
  }, []);

  const handleCheckin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!carnet.trim() || isPending) return;

    try {
      await postCheckin(carnet);
      setCarnet(""); 
      toast.success("¡Check-in realizado!");
      
      setTimeout(() => {
        reset();
        inputRef.current?.focus(); 
      }, 2000);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Error al registrar ingreso");
      setCarnet(""); 
    }
  };

  const student = response?.checkin;

  return (
    <Container 
      maxWidth="sm" 
      // 1. Spacing dinámico: Menos espacio arriba en pantallas pequeñas/tablets horizontales
      sx={{ 
        py: { xs: 4, sm: 6, md: 10 }, 
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "center",
        minHeight: "100vh" // Centrado vertical absoluto en pantallas de tablet
      }}
    >
      <Paper 
        elevation={6} 
        // 2. Padding adaptativo y bordes más limpios para formato kiosco
        sx={{ 
          p: { xs: 3, sm: 5 }, 
          borderRadius: 4, 
          textAlign: 'center',
          transition: "all 0.3s ease-in-out"
        }}
      >
        {/* 3. Título con tamaño responsivo */}
        <Typography 
          variant="h4" 
          sx={{ fontSize: { xs: "1.5rem", sm: "2rem" }, fontWeight: "800", mb: 3 }}
        >
          Registro de Ingreso
        </Typography>
        
        <form onSubmit={handleCheckin}>
          <TextField
            fullWidth
            inputRef={inputRef}
            label={isPending ? "Procesando..." : "Esperando lectura de carnet..."}
            variant="outlined"
            placeholder="Escanee el carnet ahora"
            value={carnet}
            onChange={(e) => setCarnet(e.target.value)}
            autoComplete="off" 
            // Tip de Tablet: Si se usa un lector físico, esto evita que se abra el teclado virtual de la tablet y estorbe
            // Descomenta la siguiente línea si usas un lector láser USB/Bluetooth externo:
            // inputMode="none"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeIcon color={isPending ? "action" : "primary"} />
                </InputAdornment>
              ),
              endAdornment: isPending && <CircularProgress size={20} />
            }}
            // Input un poco más alto para facilitar la legibilidad a distancia en un soporte de tablet
            sx={{ 
              mb: 4,
              "& .MuiOutlinedInput-root": {
                height: { sm: 64 }, 
                fontSize: { sm: "1.2rem" }
              }
            }}
          />
        </form>

        <Box 
          sx={{ 
            minHeight: { xs: 220, sm: 260 }, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            bgcolor: student ? "success.lightest" : "transparent", // Opcional: Feedback visual de fondo
            borderRadius: 3,
            p: 2
          }}
        >
          {student ? (
            <Fade in={!!student}>
              <Stack alignItems="center" spacing={3}>
                {/* 4. Avatar más imponente en Tablets para verificación visual del guardia */}
                <Avatar 
                  src={student.photo} 
                  sx={{ 
                    width: { xs: 120, sm: 160 }, 
                    height: { xs: 120, sm: 160 }, 
                    border: '5px solid', 
                    borderColor: 'success.main',
                    boxShadow: 3
                  }} 
                />
                <Box>
                  <Typography 
                    variant="h5" 
                    sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" }, fontWeight: "bold", mb: 0.5 }}
                  >
                    {student.lastName} {student.firstName} 
                  </Typography>
                  <Typography 
                    color="success.main" 
                    sx={{ fontSize: { xs: "1rem", sm: "1.2rem" }, fontWeight: "bold" }}
                  >
                    <CheckCircleIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: { xs: 20, sm: 26 } }} />
                    INGRESO EXITOSO
                  </Typography>
                </Box>
              </Stack>
            </Fade>
          ) : (
            <Typography 
              variant="body1" 
              color="text.disabled" 
              sx={{ fontStyle: 'italic', fontSize: { xs: "0.9rem", sm: "1.1rem" } }}
            >
              {isPending ? "Validando base de datos..." : "El cursor está listo para recibir el código"}
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
}