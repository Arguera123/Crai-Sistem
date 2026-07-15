import { Box, Typography, Paper, Container, Stack } from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';
import { CheckinTable } from "../components/Tables/CheckinTable"; 

export function CheckinQueryView() {
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#f8fafc', 
      pb: 6,
      pt: '80px'
    }}>
      <Container maxWidth="xl">
        <Box mb={4} pt={4}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ 
              p: 1.5, 
              borderRadius: 3, 
              bgcolor: 'secondary.main', 
              color: 'white',
              display: 'flex', 
              boxShadow: '0 8px 16px rgba(156, 39, 176, 0.2)' 
            }}>
              <LoginIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="900" letterSpacing="-0.5px">
                Registro de Ingresos
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Monitoreo de accesos y flujo de usuarios en tiempo real.
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
          <Box sx={{ p: 2 }}>
            <CheckinTable /> 
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}