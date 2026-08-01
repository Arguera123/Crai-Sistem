import { useMemo, useState } from "react";
import type { TUserFilters } from "../../types/filters";
import { useRegister, useUsers } from "../../hooks/useUsers";
import { useServerTable } from "../../hooks/useServerTable";
import { CircularProgress, Grid, Box, Button, Paper, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { FilterBar } from "./FilterBar";
import { DataTable } from "./DataTable";
import { PaginationControls } from "./PaginationControls";
import { TableLoading, TableError } from "./TableStatus";
import { USER_FILTER_CONFIG } from "../../config/UserFilters.config";
import { UserFormModal } from "../UserFormModal";
import { getUserColumns } from "./columns/user.columns";
import { useAuth } from "../../hooks/authProvider";

const DEFAULT_PAGE_SIZE = 20;

export const UserTable = () => {
  const { user } = useAuth();
  const { mutate: createUser } = useRegister();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    visualFilters,
    setVisualFilters,
    pagination,
    setPagination,
    data,
    paginationMeta,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useServerTable<any, TUserFilters>(useUsers, {
    defaultPageSize: DEFAULT_PAGE_SIZE,
  });

  const handleCreateClick = () => {
    setIsModalOpen(true);
  };

  const columns = useMemo(() => getUserColumns(user?.roles), [user?.roles]);

  const handleSaveUser = (data: any) => {
    createUser(data);
    setIsModalOpen(false);
  };

  if (isLoading) {
    return <TableLoading />;
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

      <Grid size={12} sx={{ position: "relative" }}>
        {isError ? (
          <TableError onRetry={() => refetch()} message="No se pudieron cargar los usuarios." />
        ) : (
          <>
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
          </>
        )}
      </Grid>

      <UserFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveUser}
      />
    </Grid>
  );
};