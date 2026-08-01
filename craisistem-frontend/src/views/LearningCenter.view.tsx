import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Container,
  Paper,
  Divider,
  Stack,
  Fade,
  Chip,
} from "@mui/material";
import { useState } from "react";
import { useUserById } from "../hooks/useUserById";
import { useDebounce } from "../hooks/useDebounce";
import { DeviceCard } from "../components/DeviceCard";
import { useActiveDevice } from "../hooks/useDevice";
import WindowIcon from "@mui/icons-material/Window";
import AppleIcon from "@mui/icons-material/Apple";
import TerminalIcon from "@mui/icons-material/Terminal";
import DevicesIcon from "@mui/icons-material/Devices";
import ComputerIcon from '@mui/icons-material/Computer';
import {
  useActiveDeviceLoans,
  useDeviceLoanCharge,
  useDeviceLoanRelease,
} from "../hooks/useActiveDeviceLoans";
import { ActiveLoanCard } from "../components/ActiveDeviceLoanCard";

import { toast } from "react-toastify";

const getOsIcon = (os?: string) => {
  const props = { sx: { fontSize: 20, color: 'action.active' } };
  switch (os) {
    case "windows": return <WindowIcon {...props} />;
    case "linux": return <TerminalIcon {...props} />;
    case "mac": return <AppleIcon {...props} />;
    default: return <DevicesIcon {...props} />;
  }
};

export default function LearningCenter() {
  const [carnet, setCarnet] = useState("");
  const [deviceId, setDeviceId] = useState<number | "">("");

  const debouncedCarnet = useDebounce(carnet, 500);
  const { data: user } = useUserById(debouncedCarnet);
  const { data: deviceResponse } = useActiveDevice(1, 40);
  const devices = deviceResponse?.data ?? [];

  const chargeLoan = useDeviceLoanCharge();
  const releaseLoan = useDeviceLoanRelease();
  const { data: loansResponse } = useActiveDeviceLoans();
  const activeLoans = loansResponse?.data ?? [];

  const selectedDevice = devices.find((d: any) => d.id === deviceId);

  const handleStart = async () => {
    if (!carnet || !deviceId) {
      toast.warn("Por favor complete todos los campos obligatorios");
      return;
    }

    const loanPromise = chargeLoan.mutateAsync({
      userId: carnet,
      resourceId: Number(deviceId),
    });

    toast.promise(loanPromise, {
      pending: "Registrando préstamo...",
      success: {
        render() {
          setCarnet("");
          setDeviceId("");
          return "¡Dispositivo asignado con éxito!";
        },
      },
    });
  };

  const handleFinishLoan = async (loanId: string) => {
    const releasePromise = releaseLoan.mutateAsync(loanId);

    toast.promise(releasePromise, {
      pending: "Finalizando sesión...",
      success: "Sesión cerrada correctamente",
    });
  };

  const handleCancel = () => {
    setCarnet("");
    setDeviceId("");
    toast.info("Acción cancelada");
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#f8fafc',
      pt: '112px', 
      pb: 6
    }}>
      <Container maxWidth="xl">
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4} alignItems="stretch">
          
          <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider', width: { md: 400 } }}>
            <Stack spacing={1} mb={3}>
              <Typography variant="h5" fontWeight="800" color="primary.main">
                Nuevo Préstamo
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Asigne un dispositivo a un estudiante mediante su carnet.
              </Typography>
            </Stack>

            <Stack spacing={3}>
              <TextField
                label="Número de Carnet"
                placeholder="Ej: 00012320"
                value={carnet}
                onChange={(e) => setCarnet(e.target.value)}
                fullWidth
                autoComplete="off"
                InputProps={{ sx: { borderRadius: 2 } }}
              />

              <FormControl fullWidth>
                <InputLabel id="device-label">Seleccionar Dispositivo</InputLabel>
                <Select
                  labelId="device-label"
                  label="Seleccionar Dispositivo"
                  value={deviceId}
                  onChange={(e) => setDeviceId(e.target.value as number)}
                  sx={{ borderRadius: 2 }}
                >
                  {devices.map((device) => (
                    <MenuItem 
                      key={device.id} 
                      value={device.id} 
                      disabled={activeLoans.some(l => l.device.id === device.id)}
                    >
                      <Box display="flex" alignItems="center" gap={2}>
                        {getOsIcon(device.operatingSystem)}
                        <Typography variant="body2" fontWeight="500">Equipo {device.id}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Paper>

          {/* VISTA PREVIA DE LA ASIGNACIÓN */}
          <Box flex={1} display="flex" justifyContent={{ xs: 'center', md: 'flex-start' }} alignItems="center">
            <Fade in={true}>
              <Box>
                <DeviceCard
                  deviceName={selectedDevice?.id}
                  firstName={user?.firstName}
                  lastName={user?.lastName}
                  operatingSystem={selectedDevice?.operatingSystem}
                  onStart={handleStart}
                  onCancel={handleCancel}
                  disabled={!user || !deviceId || chargeLoan.isPending}
                  photoUrl={user?.photo}
                />
              </Box>
            </Fade>
          </Box>
        </Box>

        <Divider sx={{ my: 6 }} />
        <Box>
          <Stack direction="row" alignItems="center" spacing={1.5} mb={4}>
            <ComputerIcon color="primary" />
            <Typography variant="h5" fontWeight="800">
              Sesiones Activas
            </Typography>
            <Chip
              label={activeLoans.length} 
              color="primary" 
              size="small" 
              sx={{ fontWeight: 'bold' }} 
            />
          </Stack>

          {activeLoans.length === 0 ? (
            <Paper variant="outlined" sx={{ p: 8, textAlign: 'center', borderRadius: 4, borderStyle: 'dashed' }}>
              <Typography color="text.secondary" variant="h6">
                No hay préstamos activos en este momento.
              </Typography>
              <Typography variant="body2" color="text.disabled">
                Los nuevos préstamos aparecerán aquí automáticamente.
              </Typography>
            </Paper>
          ) : (
            <Box 
              sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
                gap: 4 
              }}
            >
              {activeLoans.map((loan) => (
                <Fade key={loan.id} in={true}>
                  <Box>
                    <ActiveLoanCard
                      deviceId={loan.device.id}
                      operatingSystem={loan.device.operatingSystem}
                      firstName={loan.user.firstName}
                      lastName={loan.user.lastName}
                      startTime={loan.charge?.startTime}
                      onFinish={() => handleFinishLoan(loan.id)}
                    />
                  </Box>
                </Fade>
              ))}
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}