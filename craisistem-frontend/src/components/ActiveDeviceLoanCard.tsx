import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  Button,
  Divider,
} from "@mui/material";

// ICONOS
import WindowIcon from "@mui/icons-material/Window";
import AppleIcon from "@mui/icons-material/Apple";
import TerminalIcon from "@mui/icons-material/Terminal";
import DevicesIcon from "@mui/icons-material/Devices";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';

interface ActiveLoanCardProps {
  deviceId: number;
  operatingSystem?: "windows" | "linux" | "mac" | "";
  firstName: string;
  lastName: string;
  startTime: string | undefined;
  onFinish?: () => void;
}

/**
 * Mapeo de configuración de SO
 * Devolvemos la referencia al componente (Icon) para usarlo como JSX
 */
const getOsConfig = (os?: string) => {
  switch (os) {
    case "windows":
      return { Icon: WindowIcon, color: "#0078d4", label: "Windows" };
    case "linux":
      return { Icon: TerminalIcon, color: "#333", label: "Linux" };
    case "mac":
      return { Icon: AppleIcon, color: "#555", label: "macOS" };
    case "":
    default:
      return { Icon: DevicesIcon, color: "#757575", label: "Equipo" };
  }
};

const formatTime = (time?: string) =>
  time ? time.split(".")[0].slice(0, 5) : "--:--";

export function ActiveLoanCard({
  deviceId,
  operatingSystem,
  firstName,
  lastName,
  startTime,
  onFinish,
}: ActiveLoanCardProps) {
  const { Icon, color } = getOsConfig(operatingSystem);

  return (
    <Card
      sx={{
        width: 220,
        minHeight: 330,
        borderRadius: 4,
        display: "flex",
        flexDirection: "column",
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 20px rgba(0,0,0,0.08)',
        }
      }}
      elevation={0}
    >
      {/* INDICADOR DE ESTADO SUPERIOR (COLOR DEL SO) */}
      <Box sx={{ bgcolor: color, height: 6 }} />

      <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", p: 2.5 }}>
        
        {/* HEADER: ID DEL EQUIPO E ICONO DEL SO */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', letterSpacing: 0.5 }}>
              EQUIPO
            </Typography>
            <Typography fontWeight="900" variant="h3" lineHeight={1} color="primary.main">
              {deviceId}
            </Typography>
          </Box>
          <Box sx={{ color: color, opacity: 0.8 }}>
             {/* Renderizado directo del componente Icon con sus props */}
             <Icon sx={{ fontSize: 32 }} />
          </Box>
        </Box>

        {/* ÁREA DE TIEMPO (RELOJ) */}
        <Box 
          mt={3} 
          p={1.5} 
          sx={{ 
            bgcolor: 'primary.50', 
            borderRadius: 3, 
            textAlign: 'center',
            border: '1px dashed',
            borderColor: 'primary.200'
          }}
        >
          <Stack direction="row" spacing={0.5} justifyContent="center" alignItems="center" color="primary.dark" mb={0.5}>
            <AccessTimeIcon sx={{ fontSize: 14 }} />
            <Typography variant="caption" fontWeight="bold" sx={{ textTransform: 'uppercase' }}>
              Inicio de sesión
            </Typography>
          </Stack>
          <Typography fontWeight="800" variant="h4" color="primary.dark">
            {formatTime(startTime)}
          </Typography>
        </Box>

        {/* INFORMACIÓN DEL USUARIO */}
        <Box mt={3}>
          <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
            <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary" fontWeight="bold" sx={{ textTransform: 'uppercase' }}>
              Usuario activo
            </Typography>
          </Stack>
          <Typography variant="body1" fontWeight="700" sx={{ lineHeight: 1.2, mb: 0.2 }}>
            {firstName}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {lastName}
          </Typography>
        </Box>

        {/* SECCIÓN DE ACCIONES AL FINAL */}
        <Box sx={{ mt: 'auto', pt: 2 }}>
            <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />
            {onFinish && (
              <Button
                color="error"
                variant="contained"
                fullWidth
                onClick={onFinish}
                sx={{ 
                  borderRadius: 2.5, 
                  py: 1, 
                  fontWeight: 'bold',
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(211, 47, 47, 0.2)',
                  '&:hover': {
                    bgcolor: 'error.main',
                    boxShadow: '0 6px 16px rgba(211, 47, 47, 0.3)',
                  }
                }}
              >
                Finalizar sesión
              </Button>
            )}
        </Box>
      </CardContent>
    </Card>
  );
}