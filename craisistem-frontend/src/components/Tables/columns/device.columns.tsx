import { createColumnHelper } from "@tanstack/react-table";
import { Box, Typography, Chip, IconButton } from "@mui/material";
import WindowIcon from "@mui/icons-material/Window";
import AppleIcon from "@mui/icons-material/Apple";
import TerminalIcon from "@mui/icons-material/Terminal";
import DevicesIcon from "@mui/icons-material/Devices";
import EditIcon from "@mui/icons-material/Edit";
import type { IDevice } from "../../../types/device";

const deviceHelper = createColumnHelper<IDevice>();

const getOsIcon = (os?: string) => {
  const props = { sx: { fontSize: 18, color: 'action.active' } };
  switch (os?.toLowerCase()) {
    case "windows": return <WindowIcon {...props} />;
    case "linux": return <TerminalIcon {...props} />;
    case "mac": return <AppleIcon {...props} />;
    default: return <DevicesIcon {...props} />;
  }
};

export const getDeviceColumns = (onEdit: (device: IDevice) => void) => [
  deviceHelper.accessor("id", {
    header: "ID",
    size: 70,
    cell: (info) => <Typography variant="body2" fontWeight="bold">#{info.getValue()}</Typography>
  }),

  deviceHelper.accessor("operatingSystem", {
    header: "S.O.",
    size: 100,
    cell: (info) => (
      <Box display="flex" alignItems="center" gap={1}>
        {getOsIcon(info.getValue())}
        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
          {info.getValue()}
        </Typography>
      </Box>
    ),
  }),

  deviceHelper.accessor("brand", {
    header: "Marca y Modelo",
    size: 200,
    cell: (info) => {
      const row = info.row.original;
      return (
        <Box>
          <Typography variant="body2" fontWeight={500}>{info.getValue()}</Typography>
          <Typography variant="caption" color="text.secondary">{row.model}</Typography>
        </Box>
      );
    }
  }),

  deviceHelper.accessor("inventory", {
    header: "Inventario",
    size: 150,
  }),

  deviceHelper.accessor("section", {
    header: "Sección",
    size: 120,
    cell: (info) => <Chip label={info.getValue()} size="small" variant="outlined" />
  }),

  deviceHelper.accessor("state", {
    header: "Estado",
    size: 120,
    cell: (info) => {
      const state = info.getValue()?.toLowerCase();
      const isFree = state === "free" || state === "disponible";
      const isMaintenance = state === "maintenance";
      return (
        <Chip
          label={isFree ? "Disponible" : isMaintenance ? "Mantenimiento" : "Ocupado"}
          size="small"
          color={isFree ? "success" : isMaintenance ? "warning" : "error"}
          sx={{ fontWeight: 'bold' }}
        />
      );
    },
  }),

  deviceHelper.display({
    id: "actions",
    header: "Acciones",
    size: 80,
    cell: (info) => (
      <IconButton 
        size="small" 
        color="primary" 
        onClick={() => onEdit(info.row.original)}
      >
        <EditIcon fontSize="small" />
      </IconButton>
    ),
  }),
];