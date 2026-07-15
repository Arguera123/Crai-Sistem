import { useMemo, useState, useEffect } from "react";
import type { TUserFilters } from "../../types/filters";
import { useDebounce } from "../../hooks/useDebounce";
import type { TPagination } from "../../types/pagination";
import { useRegister, useUsers } from "../../hooks/useUsers";
import { CircularProgress, Grid, Box, Button, Paper, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { FilterBar } from "./FilterBar";
import { DataTable } from "./DataTable";
import { PaginationControls } from "./PaginationControls";
import { USER_FILTER_CONFIG } from "../../config/UserFilters.config";
import { UserFormModal } from "../UserFormModal";
import { getUserColumns } from "./columns/user.columns";
import { useAuth } from "../../hooks/authProvider";

const DEFAULT_PAGE_SIZE = 20;

export const UserTable = () => {
  const { user } = useAuth();
  const { mutate: createUser } = useRegister();

  const [visualFilters, setVisualFilters] = useState<TUserFilters>({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedFilters = useDebounce(visualFilters, 500);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [debouncedFilters]);

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
    } as TUserFilters;
  }, [debouncedFilters, pagination.pageIndex, pagination.pageSize]);

  const { data: response, isFetching, isLoading } = useUsers(filters);

  const handleCreateClick = () => {
    setIsModalOpen(true);
  };

  const columns = useMemo(() => getUserColumns(user?.roles), [user?.roles]);

  const handleSaveUser = (data: any) => {
    console.log("Datos recibidos del modal:", data);
    createUser(data);
    setIsModalOpen(false);
  };

  const data = response?.data ?? [];
  const paginationMeta: TPagination = response?.pagination ?? {
    total: 0,
    limit: DEFAULT_PAGE_SIZE,
    page: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={10}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      <Grid size={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
        <Box sx={{ flexGrow: 1 }}>
          <FilterBar
            filters={visualFilters} 
            onFilterChange={setVisualFilters} 
            config={USER_FILTER_CONFIG}
          />
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={handleCreateClick}
          sx={{ height: 56, px: 3, borderRadius: 2, whiteSpace: 'nowrap' }}
        >
          Nuevo Usuario
        </Button>
      </Grid>

      {/* Tabla de Datos */}
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
          <DataTable
            data={data}
            columns={columns}
            pagination={pagination}
            onPaginationChange={setPagination}
            pageCount={paginationMeta.totalPages}
          >
            {(table) => (
              <PaginationControls table={table} meta={paginationMeta} />
            )}
          </DataTable>
        </Paper>
      </Grid>

      <UserFormModal 
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveUser}
      />
    </Grid>
  );
};