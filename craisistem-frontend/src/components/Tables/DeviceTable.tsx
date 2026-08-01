import { Grid, CircularProgress, Box, Paper, Typography, Button } from "@mui/material";
import { useMemo, useState, useCallback } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useDevice } from "../../hooks/useDevice";
import { useCreateDevice, useUpdateDevice } from "../../hooks/useManipulateDevice";
import { DataTable } from "./DataTable";
import { PaginationControls } from "./PaginationControls";
import { FilterBar } from "./FilterBar";
import { useDebounce } from "../../hooks/useDebounce";
import { DEVICE_FILTER_CONFIG } from "../../config/DeviceFilters.config";
import { getDeviceColumns } from "./columns/device.columns";
import type { TPagination } from "../../types/pagination";
import type { IDevice, TCreateDevice, TUpdateDevice } from "../../types/device";
import type { TDeviceFilters } from "../../types/filters";
import { EditDeviceModal } from "../EditDeviceModal";

const DEFAULT_PAGE_SIZE = 10;

export const DeviceTable = () => {
  const { mutate: updateDevice, isPending: isUpdating } = useUpdateDevice();
  const { mutate: createDevice } = useCreateDevice();

  const [visualFilters, setVisualFilters] = useState<Partial<TDeviceFilters>>({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE });
  
  const [selectedDevice, setSelectedDevice] = useState<IDevice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedFilters = useDebounce(visualFilters, 500);

  const filters = useMemo(() => {
    const cleaned = Object.fromEntries(
      Object.entries(debouncedFilters).filter(([_, v]) => v !== "" && v !== undefined && v !== null)
    );
    return {
      ...cleaned,
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    };
  }, [debouncedFilters, pagination]);

  const { data: response, isFetching, isLoading } = useDevice(filters);

  const handleEditClick = useCallback((device: IDevice) => {
    setSelectedDevice(device);
    setIsModalOpen(true);
  }, []);

  const handleCreateClick = () => {
    setSelectedDevice(null);
    setIsModalOpen(true);
  };

  const handleSaveDevice = (id: number | undefined, data: TUpdateDevice) => {
    if (id) {
      updateDevice({ deviceId: id, params: data }, {
        onSuccess: () => setIsModalOpen(false),
      });
    } else {
      const deviceData: TCreateDevice = {
        brand: data.brand || "", 
        state: data.state || "Disponible", 
        section: data.section || "",
        model: data.model || "",
        inventory: data.inventory || "",
        operatingSystem: data.operatingSystem || "windows", 
      };
      createDevice(deviceData, {
        onSuccess: () => setIsModalOpen(false),
      });
    }
  };

  const handleFilterChange = (newFilters: Partial<TDeviceFilters>) => {
    setVisualFilters(newFilters);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const columns = useMemo(() => getDeviceColumns(handleEditClick), [handleEditClick]);

  const data = response?.data ?? [];
  const paginationMeta: TPagination = response?.pagination ?? {
    total: 0, limit: DEFAULT_PAGE_SIZE, page: 1, totalPages: 1, hasNextPage: false, hasPreviousPage: false,
  };

  if (isLoading) {
    return (
      <Box display="flex" flex={1} justifyContent="center" alignItems="center" py={10}>
        <CircularProgress size={40} thickness={4} />
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {/* Header: Filtros + Botón Nuevo */}
      <Grid size={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
        <Box sx={{ flexGrow: 1 }}>
          <FilterBar 
            filters={visualFilters} 
            onFilterChange={handleFilterChange} 
            config={DEVICE_FILTER_CONFIG} 
          />
        </Box>
        <Button 
          size="small"
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={handleCreateClick}
          sx={{ height: 56, px: 4, borderRadius: 2, whiteSpace: 'nowrap' }}
        >
          Nuevo Equipo
        </Button>
      </Grid>

      {/* Tabla de Datos */}
      <Grid size={12} sx={{ position: "relative" }}>
        {isFetching && (
          <Box sx={{ position: "absolute", top: 12, right: 24, zIndex: 10, display: "flex", alignItems: "center", gap: 1, bgcolor: 'background.paper', px: 1.5, py: 0.5, borderRadius: 20, boxShadow: 1, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>Cargando...</Typography>
            <CircularProgress size={12} thickness={6} />
          </Box>
        )}

        <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden", opacity: isFetching ? 0.8 : 1, transition: 'opacity 0.2s' }}>
          <DataTable
            data={data}
            columns={columns}
            pagination={pagination}
            onPaginationChange={setPagination}
            pageCount={paginationMeta.totalPages}
          >
            {(table) => <PaginationControls table={table} meta={paginationMeta} />}
          </DataTable>
        </Paper>
      </Grid>

      {/* Modal Reutilizable */}
      <EditDeviceModal
        open={isModalOpen}
        device={selectedDevice}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveDevice}
        isLoading={isUpdating}
      />
    </Grid>
  );
};