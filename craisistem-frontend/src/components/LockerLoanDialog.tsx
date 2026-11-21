import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Avatar,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Stack,
  Zoom,
  InputAdornment
} from "@mui/material";
import TagIcon from '@mui/icons-material/Tag';
import SearchIcon from '@mui/icons-material/Search';
import BadgeIcon from '@mui/icons-material/Badge';
import { useDebounce } from "../hooks/useDebounce";
import { useUserById } from "../hooks/useUserById";
type Props = {
  open: boolean;
  locker: { id: string } | null;
  onClose: () => void;
  onConfirm: (userId: string, lockerId: string) => Promise<void>;
};

export default function LockerLoanDialog({ open, locker, onClose, onConfirm }: Props) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedQuery = useDebounce(query, 500);
  const { data: user, isFetching } = useUserById(debouncedQuery);

  if (!locker) return null;

  const handleClose = () => {
    setQuery("");
    setError(null);
    onClose();
  };

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      await onConfirm(user.id, locker.id);
      handleClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.response?.data?.errors?.[0]?.message || err.message || "Error al procesar el préstamo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      fullWidth 
      maxWidth="xs"
      PaperProps={{ sx: { borderRadius: 4, backgroundImage: 'none' } }}
    >
      <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
        <Box display="flex" justifyContent="center" alignItems="center" gap={1} mb={1}>
          <TagIcon color="primary" />
          <Typography variant="h5" fontWeight="800">
            Locker #{locker.id}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Registro de préstamo de casillero
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" variant="filled" sx={{ borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* TARJETA DE USUARIO DINÁMICA */}
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: user ? 'primary.50' : 'grey.50',
              borderColor: user ? 'primary.200' : 'divider',
              transition: 'all 0.4s ease-in-out',
              position: 'relative'
            }}
          >
            <Box position="relative">
              <Avatar
                sx={{ 
                  width: 90, 
                  height: 90, 
                  mb: 2,
                  border: `4px solid ${user ? '#fff' : '#e0e0e0'}`,
                  boxShadow: user ? 4 : 0
                }}
                src={user?.photo ?? undefined}
              >
                {user?.firstName?.[0] ?? <BadgeIcon sx={{ fontSize: 40 }} />}
              </Avatar>
              
              {isFetching && (
                <CircularProgress
                  size={100}
                  sx={{
                    position: 'absolute',
                    top: -5,
                    left: -5,
                    zIndex: 1,
                  }}
                />
              )}
            </Box>

            <Zoom in={!isFetching}>
              <Box textAlign="center">
                <Typography variant="h6" fontWeight="700" color={user ? 'text.primary' : 'text.secondary'}>
                  {user ? `${user.firstName} ${user.lastName}` : "Identificación Pendiente"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user ? `Carnet: ${user.id}` : "Escanee o digite el carnet"}
                </Typography>
              </Box>
            </Zoom>
          </Paper>

          {/* CAMPO DE BÚSQUEDA */}
          <TextField
            label="ID de Usuario"
            fullWidth
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
            placeholder="Ej: 00123420"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
              }
            }}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button 
          onClick={handleClose} 
          disabled={loading}
          sx={{ borderRadius: 2, fontWeight: 600 }}
          color="inherit"
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!user || loading || isFetching}
          fullWidth
          sx={{ 
            borderRadius: 2, 
            py: 1.2, 
            fontWeight: 700,
            boxShadow: 3
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Confirmar Préstamo"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}