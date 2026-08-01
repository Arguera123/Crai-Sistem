import { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Stack,
  Chip,
  Divider,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useLockers } from "../hooks/useLockers";
import LockersGrid from "../components/LockersGrid";
import LockerLoanDialog from "../components/LockerLoanDialog";
import InventoryIcon from "@mui/icons-material/Inventory";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockIcon from "@mui/icons-material/Lock";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {
  useActiveLockerLoans,
  useLockerLoanCharge,
  useLockerLoanRelease,
} from "../hooks/useActiveLockerLoans";
import type { TLockerLoanResponse } from "../types/loan";

import { toast } from "react-toastify";

export enum ResourceStates {
  FREE = "free",
  OCCUPIED = "occupied",
}

export default function LockersView() {
  const { data: lockersResponse, isLoading } = useLockers();
  const lockers = lockersResponse?.data ?? [];

  const [selectedLocker, setSelectedLocker] = useState<any | null>(null);

  // Mutaciones
  const chargeLoan = useLockerLoanCharge();
  const releaseLoan = useLockerLoanRelease();

  const total = lockers.length;
  const occupied = lockers.filter(
    (l: any) => l.state === ResourceStates.OCCUPIED,
  ).length;
  const available = total - occupied;

  const { data: loansResponse } = useActiveLockerLoans();
  const activeLoans = loansResponse?.data ?? [];

  const currentLoan = activeLoans.find(
    (loan: TLockerLoanResponse) =>
      Number(loan.locker.id) === Number(selectedLocker?.id),
  );

  const handleConfirmLoan = async (userId: string, lockerId: string) => {
    const loanPromise = chargeLoan.mutateAsync({
      userId,
      resourceId: Number(lockerId),
    });

    toast.promise(loanPromise, {
      pending: "Asignando casillero...",
      success: {
        render() {
          setSelectedLocker(null);
          return `Locker #${lockerId} asignado correctamente`;
        },
      },
    });
  };

  // 3. Manejo de Liberación con Toast
  const handleReleaseLocker = async () => {
    if (!currentLoan) {
      toast.error("No se encontró un préstamo activo para este locker");
      return;
    }

    const releasePromise = releaseLoan.mutateAsync(currentLoan.id);

    toast.promise(releasePromise, {
      pending: "Liberando casillero...",
      success: {
        render() {
          setSelectedLocker(null);
          return "Casillero liberado correctamente";
        },
      },
    });
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Stack alignItems="center" spacing={2}>
          <CircularProgress size={60} thickness={4} />
          <Typography
            variant="body1"
            color="text.secondary"
            fontWeight="medium"
          >
            Sincronizando casilleros...
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", pt: "112px", pb: 8 }}>
      <Container maxWidth="xl">
        {/* HEADER */}
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          mb={5}
          gap={2}
        >
          <Stack spacing={0.5}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <InventoryIcon color="primary" sx={{ fontSize: 32 }} />
              <Typography variant="h4" fontWeight="900" letterSpacing="-0.5px">
                Control de Lockers
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary">
              Gestión y asignación de casilleros en tiempo real
            </Typography>
          </Stack>

          <Paper
            elevation={0}
            sx={{
              p: 1,
              borderRadius: 3,
              display: "flex",
              gap: 1,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Chip
              icon={<CheckCircleIcon />}
              label={`${available} Disponibles`}
              color="success"
              sx={{ fontWeight: "bold" }}
            />

            <Chip
              icon={<LockIcon />}
              label={`${occupied} Ocupados`}
              color="error"
              sx={{ fontWeight: "bold" }}
            />
          </Paper>
        </Box>

        <Divider sx={{ mb: 5, borderStyle: "dashed" }} />

        {/* GRID */}
        <Box sx={{ animation: "fadeIn 0.5s ease-out" }}>
          <LockersGrid lockers={lockers} onSelectLocker={setSelectedLocker} />
        </Box>

        {/* MODAL 1: PRESTAR (Si el locker está libre) */}
        {selectedLocker?.state === ResourceStates.FREE && (
          <LockerLoanDialog
            open={!!selectedLocker}
            locker={selectedLocker}
            onClose={() => setSelectedLocker(null)}
            onConfirm={handleConfirmLoan}
          />
        )}

        {/* MODAL 2: LIBERAR (Si el locker está ocupado) */}
        <Dialog
          open={
            !!selectedLocker && selectedLocker.state === ResourceStates.OCCUPIED
          }
          onClose={() => setSelectedLocker(null)}
          PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
        >
          <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <WarningAmberIcon color="warning" />
            Finalizar Préstamo
          </DialogTitle>
          <DialogContent>
            <Typography>
              El locker <strong>#{selectedLocker?.id}</strong> se encuentra
              actualmente ocupado. ¿Deseas finalizar el préstamo y marcarlo como{" "}
              <strong>Disponible</strong>?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setSelectedLocker(null)} color="inherit">
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleReleaseLocker}
              disabled={releaseLoan.isPending}
            >
              {releaseLoan.isPending ? "Procesando..." : "Sí, Liberar Locker"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}