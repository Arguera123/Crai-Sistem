import { Box, Typography, Paper, Container, Stack } from "@mui/material";
import ComputerIcon from '@mui/icons-material/Computer';
import { DeviceLoanTable } from "../components/Tables/DeviceLoanTable";

export function DeviceLoanQueryView() {
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#f8fafc', 
      pb: 6,
      pt: '80px'
    }}>
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Box mb={4}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ 
              p: 1.5, borderRadius: 3, bgcolor: 'secondary.main', color: 'white',
              display: 'flex', boxShadow: '0 8px 16px rgba(156, 39, 176, 0.2)' 
            }}>
              <ComputerIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="900" letterSpacing="-0.5px">
                Préstamos de Dispositivos
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Historial de laptops, tablets y otros recursos.
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
          <Box sx={{ p: 2 }}>
            <DeviceLoanTable />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}