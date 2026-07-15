import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Box,
  Avatar,
  Chip,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

interface DeviceCardProps {
  deviceName?: string | number;
  operatingSystem?: "windows" | "linux" | "mac" | "";
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  onStart: () => void;
  onCancel: () => void;
  disabled?: boolean;
}

const getOsConfig = (os?: string) => {
  switch (os) {
    case "windows": return { color: "#0078d4", label: "Windows" };
    case "linux": return { color: "#333", label: "Linux" };
    case "mac": return { color: "#555", label: "macOS" };
    default: return { color: "#757575", label: "Otro" };
  }
};

export function DeviceCard({
  deviceName,
  operatingSystem,
  firstName,
  lastName,
  photoUrl,
  onStart,
  onCancel,
  disabled,
}: DeviceCardProps) {
  const os = getOsConfig(operatingSystem);
  const hasUser = !!firstName;

  return (
    <Card 
      variant="outlined"
      sx={{ 
        width: 280, 
        borderRadius: 4, 
        transition: 'all 0.2s ease-in-out',
        '&:hover': { borderColor: 'primary.main', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
        position: 'relative',
        overflow: 'visible' 
      }}
    >
      <Box sx={{ height: 6, bgcolor: os.color, borderRadius: '4px 4px 0 0' }} />

      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
          <Box>
            <Typography variant="caption" sx={{ color: os.color, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {os.label}
            </Typography>
            <Typography variant="h6" fontWeight="800" sx={{ lineHeight: 1.2 }}>
              #{deviceName || "--"}
            </Typography>
          </Box>
          <Chip 
            label={disabled ? "Ocupado" : "Libre"} 
            size="small" 
            color={disabled ? "error" : "success"}
            sx={{ fontWeight: 800, height: 20, fontSize: '0.65rem' }}
          />
        </Box>
        <Box 
          sx={{ 
            p: 1.2, 
            borderRadius: 3, 
            bgcolor: hasUser ? 'primary.50' : 'grey.50', 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5,
            border: '1px solid',
            borderColor: hasUser ? 'primary.100' : 'grey.200',
            mb: 2
          }}
        >
          <Avatar 
            src={photoUrl} 
            sx={{ 
              width: 40, 
              height: 40, 
              boxShadow: hasUser ? 2 : 0,
              border: `2px solid #fff`,
              bgcolor: 'background.paper',
              color: 'text.secondary',
              fontSize: '1rem'
            }}
          >
            {hasUser ? firstName[0] : <PersonIcon fontSize="small" />}
          </Avatar>
          
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" fontWeight="800" noWrap sx={{ color: hasUser ? 'text.primary' : 'text.disabled', lineHeight: 1.2 }}>
              {hasUser ? `${firstName} ${lastName}` : "Disponible"}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
              {hasUser ? "Usuario activo" : "Sin asignar"}
            </Typography>
          </Box>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            fullWidth
            size="small"
            onClick={onStart}
            disabled={disabled}
            sx={{ 
              borderRadius: 2, 
              textTransform: 'none', 
              fontWeight: 700,
              fontSize: '0.8rem',
              boxShadow: 'none'
            }}
          >
            Iniciar
          </Button>

          <Button
            variant="outlined"
            size="small"
            onClick={onCancel}
            sx={{ 
              borderRadius: 2, 
              textTransform: 'none', 
              fontWeight: 700,
              fontSize: '0.8rem',
              minWidth: 'auto',
              px: 2,
              color: 'text.secondary',
              borderColor: 'grey.300'
            }}
          >
            X
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}