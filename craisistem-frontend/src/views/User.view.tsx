import {
  Box,
  Container,
  Typography,
  Stack,
  Paper,
  Button,
} from "@mui/material";
import PeopleIcon from '@mui/icons-material/People';
import SyncIcon from '@mui/icons-material/Sync';
import { toast } from "react-toastify";
import { UserTable } from "../components/Tables/UserTable";
import { useAuth } from "../hooks/authProvider";
import { useManualFetchUsers } from "../hooks/useUsers";
import { Roles } from "../utils/user-states.constants";

function UsersView() {
  const { user } = useAuth();
  const { mutateAsync: manualFetch, isPending } = useManualFetchUsers();

  const isAdmin = (user?.roles || []).some(
    (r: string) => r.toLowerCase() === Roles.ADMIN.toLowerCase()
  );

  const handleManualFetch = () => {
    const fetchPromise = manualFetch();

    toast.promise(fetchPromise, {
      pending: "Sincronizando usuarios...",
      success: "Usuarios sincronizados correctamente",
      error: "No se pudo sincronizar a los usuarios",
    });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f8fafc',
        pt: '112px',
        pb: 8
      }}
    >
      <Container maxWidth="xl">
        <Box mb={4}>
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 3,
                  bgcolor: 'info.main',
                  color: 'white',
                  display: 'flex',
                  boxShadow: '0 8px 16px rgba(2, 136, 209, 0.2)'
                }}
              >
                <PeopleIcon fontSize="large" />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight="900" letterSpacing="-0.5px">
                  Gestión de Usuarios
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Administre los perfiles, roles y permisos de acceso al sistema.
                </Typography>
              </Box>
            </Stack>

            {/* Solo visible para administradores: el backend ya lo protege también */}
            {isAdmin && (
              <Button
                variant="outlined"
                startIcon={<SyncIcon />}
                onClick={handleManualFetch}
                disabled={isPending}
                sx={{ borderRadius: 2, whiteSpace: 'nowrap', height: 44 }}
              >
                {isPending ? "Sincronizando..." : "Sincronizar Usuarios"}
              </Button>
            )}
          </Stack>
        </Box>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden',
            bgcolor: 'background.paper'
          }}
        >
          <Box sx={{ p: 1 }}>
            <UserTable />
          </Box>
        </Paper>

        <Box mt={4} sx={{ textAlign: 'center' }}>
          <Typography variant="caption" color="text.disabled">
            Solo los administradores pueden modificar los roles de acceso de nivel superior.
          </Typography>
        </Box>

      </Container>
    </Box>
  );
}

export default UsersView;