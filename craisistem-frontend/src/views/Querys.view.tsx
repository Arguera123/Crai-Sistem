import { 
  Box, 
  Typography, 
  Paper, 
  Container, 
  Tabs, 
  Tab, 
  Stack 
} from "@mui/material";
import { useState } from "react";
import { LockerLoanTable } from "../components/Tables/LockerLoanTable";
import { DeviceLoanTable } from "../components/Tables/DeviceLoanTable"; // Asumiendo que existe
import HistoryIcon from '@mui/icons-material/History';
import InventoryIcon from '@mui/icons-material/Inventory';
import ComputerIcon from '@mui/icons-material/Computer';

function QuerysView() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#f8fafc', 
      pt: '112px', 
      pb: 6 
    }}>
      <Container maxWidth="xl">
        
        {/* HEADER */}
        <Box mb={4}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box 
              sx={{ 
                p: 1.5, 
                borderRadius: 3, 
                bgcolor: 'secondary.main', 
                color: 'white',
                display: 'flex',
                boxShadow: '0 8px 16px rgba(156, 39, 176, 0.2)' 
              }}
            >
              <HistoryIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="900" letterSpacing="-0.5px">
                Historial de Préstamos
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Consulte y filtre los registros de lockers y dispositivos.
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* SELECTOR DE CATEGORÍA (TABS) */}
        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: 4, 
            border: '1px solid', 
            borderColor: 'divider', 
            mb: 3,
            overflow: 'hidden'
          }}
        >
          <Tabs 
            value={currentTab} 
            onChange={handleTabChange}
            indicatorColor="secondary"
            textColor="secondary"
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': { py: 2, fontWeight: 'bold', fontSize: '1rem' }
            }}
          >
            <Tab icon={<InventoryIcon />} iconPosition="start" label="Préstamos de Lockers" />
            <Tab icon={<ComputerIcon />} iconPosition="start" label="Préstamos de Dispositivos" />
          </Tabs>
        </Paper>

        {/* FILTROS (Espacio reservado) */}
        <Paper 
          variant="outlined" 
          sx={{ 
            p: 2, 
            mb: 3, 
            borderRadius: 3, 
            bgcolor: 'background.paper',
            borderStyle: 'dashed'
          }}
        >
          <Typography variant="body2" color="text.disabled" sx={{ textAlign: 'center' }}>
            Panel de Filtros: Fecha, Carnet, Bibliotecario... (Próximamente)
          </Typography>
        </Paper>

        {/* TABLA DINÁMICA */}
        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: 4, 
            border: '1px solid', 
            borderColor: 'divider',
            bgcolor: 'background.paper',
            minHeight: '400px'
          }}
        >
          {currentTab === 0 ? (
            <Box sx={{ p: 1 }}>
               <LockerLoanTable />
            </Box>
          ) : (
            <Box sx={{ p: 1 }}>
               <DeviceLoanTable />
            </Box>
          )}
        </Paper>

      </Container>
    </Box>
  );
}

export default QuerysView;