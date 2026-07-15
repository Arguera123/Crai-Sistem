import { Grid, CircularProgress } from "@mui/material";
import { useMemo, useState } from "react";
import { useDeviceLoan } from "../../hooks/useDeviceLoans";
import type { TPagination } from "../../types/pagination";
import { DataTable } from "./DataTable";
import { PaginationControls } from "./PaginationControls";
import type { TDeviceLoanFilters, TLoanFilters } from "../../types/filters";
import { FilterBar } from "./FilterBar";
import { useDebounce } from "../../hooks/useDebounce";
import { DEVICE_LOAN_FILTER_CONFIG } from "../../config/LoanFilters.config";
import { deviceLoanColumns } from "./columns/loan.columns";

const DEFAULT_PAGE_SIZE = 20;

export const DeviceLoanTable = () => {
 const [visualFilters, setVisualFilters] = useState<Partial<TDeviceLoanFilters>>({});

  const debouncedFilters = useDebounce(visualFilters, 500);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });

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
    } as TLoanFilters;
  }, [debouncedFilters, pagination]);

  const { data: response, isFetching } = useDeviceLoan(filters);
  const data = response?.data ?? [];
  const paginationMeta: TPagination = response?.pagination ?? {
    total: 0,
    limit: DEFAULT_PAGE_SIZE,
    page: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  const columns = useMemo(() => deviceLoanColumns, []);

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <FilterBar 
          filters={visualFilters} 
          onFilterChange={setVisualFilters} 
          config={DEVICE_LOAN_FILTER_CONFIG}
        />
      </Grid>

      <Grid size={12} className="relative">
        {isFetching && (
          <div className="absolute top-0 right-4 z-20">
            <CircularProgress size={20} thickness={5} />
          </div>
        )}

        <div className={isFetching ? "opacity-60 transition-opacity" : "opacity-100"}>
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
        </div>
      </Grid>
    </Grid>
  );
};