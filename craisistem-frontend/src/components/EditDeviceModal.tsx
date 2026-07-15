import { Modal, Box, Typography, TextField, Button, Stack, MenuItem, FormControl, InputLabel, Select, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import type { IDevice, TUpdateDevice } from "../types/device";

interface Props {
  device: IDevice | null;
  open: boolean;
  onClose: () => void;
  onSave: (id: number | undefined, data: TUpdateDevice) => void;
  isLoading?: boolean;
}

export const EditDeviceModal = ({ device, open, onClose, onSave, isLoading }: Props) => {
  const [form, setForm] = useState<TUpdateDevice>({});

  useEffect(() => {
    if (open) {
      setForm(device ? {
        brand: device.brand,
        model: device.model,
        inventory: device.inventory,
        section: device.section,
        state: device.state,
        operatingSystem: device.operatingSystem,
      } : {
        brand: '', model: '', inventory: '', section: '', state: 'free' as any, operatingSystem: ''
      });
    }
  }, [device, open]);

  const handleChange = (field: keyof TUpdateDevice) => (e: any) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 500, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={3}>
          {device ? `Editar Equipo #${device.id}` : 'Registrar Nuevo Equipo'}
        </Typography>
        
        <Stack spacing={2.5}>
          <Stack direction="row" spacing={2}>
            <TextField label="Marca" fullWidth value={form.brand || ''} onChange={handleChange('brand')} />
            <TextField label="Modelo" fullWidth value={form.model || ''} onChange={handleChange('model')} />
          </Stack>

          <TextField label="Inventario" fullWidth value={form.inventory || ''} onChange={handleChange('inventory')} />
          <TextField label="Sección" fullWidth value={form.section || ''} onChange={handleChange('section')} />

          <Stack direction="row" spacing={2}>
            <FormControl fullWidth>
              <InputLabel>S.O.</InputLabel>
              <Select value={form.operatingSystem || ''} label="S.O." onChange={handleChange('operatingSystem')}>
                <MenuItem value="windows">Windows</MenuItem>
                <MenuItem value="mac">Mac</MenuItem>
                <MenuItem value="linux">Linux</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select value={form.state || ''} label="Estado" onChange={handleChange('state')}>
                <MenuItem value="free">Disponible</MenuItem>
                <MenuItem value="occupied">Ocupado</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
            <Button onClick={onClose} color="inherit">Cancelar</Button>
            <Button 
              variant="contained" 
              onClick={() => onSave(device?.id, form)} 
              disabled={isLoading}
              sx={{ minWidth: 120 }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : (device ? 'Actualizar' : 'Guardar')}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
};