import { 
  Box, 
  Container, 
  Typography, 
  Stack,
  Paper,
} from "@mui/material";
import { AssignmentTable } from "../components/Tables/AssignmentTable";
import WifiIcon from '@mui/icons-material/Wifi';

function WifiUsers() {
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
          <Stack direction="row" spacing={2} alignItems="center">
            <Box 
              sx={{ 
                p: 1.5, 
                borderRadius: 3, 
                // Se cambia a info.main y se ajusta la sombra para clonar el estilo de UsersView
                bgcolor: 'info.main', 
                color: 'white',
                display: 'flex',
                boxShadow: '0 8px 16px rgba(2, 136, 209, 0.2)'
              }}
            >
              <WifiIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="900" letterSpacing="-0.5px">
                Cuentas WiFi
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Administre las credenciales y el historial de asignaciones de red.
              </Typography>
            </Box>
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
            <AssignmentTable />
          </Box>
        </Paper>

        {/* PIE DE PÁGINA INFORMATIVO */}
        <Box mt={4} sx={{ textAlign: 'center' }}>
          <Typography variant="caption" color="text.disabled">
            Las cuentas WiFi se desactivan automáticamente al llegar a su fecha de expiración.
          </Typography>
        </Box>

      </Container>
    </Box>
  );
}

export default WifiUsers;