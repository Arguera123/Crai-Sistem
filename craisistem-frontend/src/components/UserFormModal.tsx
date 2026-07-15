import { 
  Modal, Box, Typography, TextField, Button, MenuItem, Grid, IconButton 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useForm, Controller } from 'react-hook-form';
import { UserStates } from '../utils/user-states.constants';
import { UserType } from '../utils/user-type.constants';

export const USER_PREFIXES = [
  { value: UserType.LECTOR_PRIVADO, label: '4 - Lector Privado' },
  { value: UserType.LECTOR_PUBLICO, label: '5 - Lector Público' },
  { value: UserType.INVESTIGADOR_6M, label: '6 - Investigador (6M)' },
  { value: UserType.INVESTIGADOR_1M, label: '8 - Investigador (1M)' },
  { value: UserType.CORTESIA, label: '9 - Cortesía' },
  { value: UserType.HIJO_EMPLEADO, label: '17 - Hijo Empleado' },
];

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 600 },
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: '90vh',
  overflowY: 'auto',
};

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const UserFormModal = ({ open, onClose, onSubmit }: UserFormProps) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      idPrefix: '', 
      idNumber: '', 
      firstName: '',
      lastName: '',
      email: '',
      gender: '',
      expirationDate: new Date().toISOString().split('T')[0],
      state: UserStates.ACTIVE,
    }
  });

  const handleFormSubmit = (data: any) => {
    const finalData = {
      ...data,
      id: `${data.idPrefix}-${data.idNumber}`,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      gender: data.gender,
      type: data.idPrefix,
      
    };
    
    onSubmit(finalData);
    reset(); 
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" fontWeight="bold">Crear Nuevo Usuario</Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Box>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Grid container spacing={2}>
            <Grid size={5}>
              <Controller
                name="idPrefix"
                control={control}
                rules={{ required: '*' }}
                render={({ field }) => (
                  <TextField 
                    {...field} 
                    select 
                    label="Prefijo" 
                    fullWidth 
                    error={!!errors.idPrefix}
                  >
                    {USER_PREFIXES.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid size={7}>
              <Controller
                name="idNumber"
                control={control}
                rules={{ required: 'Carnet requerido', maxLength: 12 }}
                render={({ field }) => (
                  <TextField 
                    {...field} 
                    label="Número de Carnet" 
                    placeholder="Ej: 000124"
                    fullWidth 
                    error={!!errors.idNumber} 
                    helperText={errors.idNumber?.message} 
                  />
                )}
              />
            </Grid>
            <Grid size={12}>
              <Controller
                name="email"
                control={control}
                rules={{ required: 'Email requerido', pattern: { value: /^\S+@\S+$/i, message: 'Email inválido' } }}
                render={({ field }) => (
                  <TextField {...field} label="Email" fullWidth error={!!errors.email} helperText={errors.email?.message} />
                )}
              />
            </Grid>
            <Grid size={6}>
              <Controller
                name="firstName"
                control={control}
                rules={{ required: 'Requerido' }}
                render={({ field }) => (
                  <TextField {...field} label="Nombres" fullWidth error={!!errors.firstName} />
                )}
              />
            </Grid>
            <Grid size={6}>
              <Controller
                name="lastName"
                control={control}
                rules={{ required: 'Requerido' }}
                render={({ field }) => (
                  <TextField {...field} label="Apellidos" fullWidth error={!!errors.lastName} />
                )}
              />
            </Grid>
            <Grid size={6}>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="Género" fullWidth>
                    <MenuItem value="M">Masculino</MenuItem>
                    <MenuItem value="F">Femenino</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
            <Grid size={6}>
              <Controller
                name="expirationDate"
                control={control}
                render={({ field }) => (
                  <TextField {...field} type="date" label="Fecha Expiración" fullWidth InputLabelProps={{ shrink: true }} />
                )}
              />
            </Grid>
            <Grid size={12} mt={1}>
              <Button type="submit" variant="contained" fullWidth size="large" sx={{ py: 1.5 }}>
                Guardar Usuario
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  );
};