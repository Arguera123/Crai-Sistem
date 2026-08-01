import { Alert, Box, Button, CircularProgress } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

export const TableLoading = () => (
  <Box display="flex" justifyContent="center" py={10}>
    <CircularProgress size={40} />
  </Box>
);

interface TableErrorProps {
  onRetry: () => void;
  message?: string;
}

export const TableError = ({
  onRetry,
  message = "No se pudieron cargar los datos.",
}: TableErrorProps) => (
  <Alert
    severity="error"
    action={
      <Button color="inherit" size="small" startIcon={<RefreshIcon />} onClick={onRetry}>
        Reintentar
      </Button>
    }
    sx={{ my: 2 }}
  >
    {message}
  </Alert>
);