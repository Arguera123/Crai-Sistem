import { Box, Typography, Paper, Container, Stack } from "@mui/material";
import InventoryIcon from '@mui/icons-material/Inventory';

export function LockerLoanView() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', pb: 6 }}>
      <Container maxWidth="xl">
        <Box mb={4} pt={4}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ 
              p: 1.5, borderRadius: 3, bgcolor: 'primary.main', color: 'white',
              display: 'flex', boxShadow: '0 8px 16px rgba(25, 118, 210, 0.2)' 
            }}>
              <InventoryIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="900" letterSpacing="-0.5px">
                Préstamos de Lockers
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Gestión y control de llaves y espacios.
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
          <Box sx={{ p: 2 }}>
            <LockerLoanView /> 
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}