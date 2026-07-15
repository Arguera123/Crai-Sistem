import { Box, Button, CircularProgress, Grid, Paper, Typography } from "@mui/material";
import { useMemo, useRef, useState, useEffect } from "react";
import { PaginationControls } from "./PaginationControls";
import { useAssignments } from "../../hooks/useAssignments";
import { DataTableCollapse } from "./DataTableCollapse";
import type { TPagination } from "../../types/pagination";
import { renderAssignmentsDetail } from "./RenderAssignmentsDetail";
import WifiAssignDialog from "../WifiAssignDialog";
import type { TWifiUserResponse } from "../../types/wifiUser";
import { useUploadWifiCSV, useWifiUserAssignment } from "../../hooks/useWifiUser";
import { CloudUpload } from "@mui/icons-material";
import { assignmentColumns } from "./columns/assignment.columns";
import { FilterBar } from "./FilterBar";
import { useDebounce } from "../../hooks/useDebounce";
import type { TWifiUserFilters } from "../../types/filters";
import { WIFI_USER_FILTER_CONFIG } from "../../config/WifiUserFilters";

const DEFAULT_PAGE_SIZE = 10;

export const AssignmentTable = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { mutate: uploadCSV, isPending: isUploading } = useUploadWifiCSV();
  const { mutateAsync: assignWifi } = useWifiUserAssignment();

  const [selectedWifi, setSelectedWifi] = useState<TWifiUserResponse | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Estados de filtros visuales y paginación
  const [visualFilters, setVisualFilters] = useState<TWifiUserFilters>({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  // Aplicar Debounce a los filtros para evitar peticiones masivas al escribir
  const debouncedFilters = useDebounce(visualFilters, 500);

  // Resetear la página a 0 cuando cambien los filtros
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [debouncedFilters]);

  // Limpieza y formateo de los filtros antes de enviarlos a la API
  const filters = useMemo(() => {
    const cleaned = Object.fromEntries(
      Object.entries(debouncedFilters).filter(
        ([_, v]) => v !== "" && v !== undefined && v !== null
      )
    );

    return {
      ...cleaned,
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    };
  }, [debouncedFilters, pagination.pageIndex, pagination.pageSize]);

  // Consumo del Hook adaptando estados de carga y sincronización en segundo plano
  const { data: response, isLoading, isFetching } = useAssignments(filters);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadCSV(file);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleOpenModal = (wifi: TWifiUserResponse) => {
    setSelectedWifi(wifi);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedWifi(null);
    setModalOpen(false);
  };

  const columns = useMemo(() => assignmentColumns(handleOpenModal), []);

  const data = response?.data ?? [];
  const paginationMeta: TPagination = response?.pagination ?? {
    total: 0,
    limit: DEFAULT_PAGE_SIZE,
    page: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  const handleConfirmAssignment = async (userId: string, wifiUserId: string) => {
    try {
      await assignWifi({ userId, wifiUserId });
      handleCloseModal();
    } catch (error) {
      console.error("Error en la asignación", error);
      throw error; 
    }
  };

  // Pantalla de carga inicial limpia
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={10}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {/* Sección Superior: Filtros + Botón de Acción Principal */}
      <Grid size={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
        <Box sx={{ flexGrow: 1 }}>
          <FilterBar
            filters={visualFilters} 
            onFilterChange={setVisualFilters} 
            config={WIFI_USER_FILTER_CONFIG}
          />
        </Box>
        <input
          type="file"
          accept=".csv"
          hidden
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <Button
          variant="contained"
          disableElevation
          startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : <CloudUpload />}
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || isFetching}
          sx={{ height: 56, px: 3, borderRadius: 2, whiteSpace: 'nowrap', fontWeight: 700 }}
        >
          {isUploading ? "Subiendo..." : "Subir Usuarios CSV"}
        </Button>
      </Grid>
      
      {/* Contenedor de la Tabla y Estado de Sincronización */}
      <Grid size={12} sx={{ position: "relative" }}>
        {isFetching && (
          <Box sx={{ 
            position: "absolute", top: 12, right: 24, zIndex: 10, 
            display: "flex", alignItems: "center", gap: 1, 
            bgcolor: 'background.paper', px: 1.5, py: 0.5, 
            borderRadius: 20, boxShadow: 1, border: '1px solid', borderColor: 'divider' 
          }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>Sincronizando...</Typography>
            <CircularProgress size={12} thickness={6} />
          </Box>
        )}

        <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden", opacity: isFetching ? 0.7 : 1 }}>
          <DataTableCollapse
            data={data}
            columns={columns}
            pagination={pagination}
            onPaginationChange={setPagination}
            pageCount={paginationMeta.totalPages}
            renderSubComponent={renderAssignmentsDetail}
          >
            {(table) => (
              <PaginationControls table={table} meta={paginationMeta} />
            )}
          </DataTableCollapse>
        </Paper>

        <WifiAssignDialog
          open={modalOpen}
          wifiUser={selectedWifi}
          onClose={handleCloseModal}
          onConfirm={handleConfirmAssignment}
        />
      </Grid>
    </Grid>
  );
};