import { Box, Typography, Paper, Container, Stack } from "@mui/material";
import DevicesIcon from "@mui/icons-material/Devices";
import { DeviceTable } from "../components/Tables/DeviceTable";

export function DevicesMangerView() {
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#f8fafc', 
      pb: 6,
      pt: '80px' 
    }}>
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        
        {/* ENCABEZADO DE LA VISTA */}
        <Box mb={4}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ 
              p: 1.5, 
              borderRadius: 3, 
              bgcolor: 'primary.main', 
              color: 'white',
              display: 'flex', 
              boxShadow: '0 8px 16px rgba(25, 118, 210, 0.2)' 
            }}>
              <DevicesIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="900" letterSpacing="-0.5px">
                Inventario de Dispositivos
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Administre el catálogo de hardware, estados y sistemas operativos.
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* CONTENEDOR DE LA TABLA */}
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
            <DeviceTable />
          </Box>
        </Paper>

      </Container>
    </Box>
  );
}