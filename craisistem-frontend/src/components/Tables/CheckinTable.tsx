import { useMemo, useState } from "react";
import type { TCheckinFilters } from "../../types/filters";
import { useDebounce } from "../../hooks/useDebounce";
import { useChekin } from "../../hooks/useCheckin";
import type { TPagination } from "../../types/pagination";
import { checkinColumns } from "./columns/checkin.columns";
import { CircularProgress, Grid } from "@mui/material";
import { FilterBar } from "./FilterBar";
import { CHECKIN_FILTER_CONFIG } from "../../config/CheckinFilters.config";
import { PaginationControls } from "./PaginationControls";
import { DataTable } from "./DataTable";

const DEFAULT_PAGE_SIZE = 10;

export const CheckinTable = () => {
  const [visualFilters, setVisualFilters] = useState<TCheckinFilters>({});

  const debouncedFilters = useDebounce(visualFilters, 500);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const filters = useMemo(() => {
    const cleaned = Object.fromEntries(
      Object.entries(debouncedFilters).filter(
        ([_, v]) => v !== "" && v !== undefined && v !== null,
      ),
    );

    return {
      ...cleaned,
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    } as TCheckinFilters;
  }, [debouncedFilters, pagination]);

  const { data: response, isFetching} = useChekin(filters);

  const data = response?.data ?? [];
  const paginationMeta: TPagination = response?.pagination ?? {
    total: 0,
    limit: DEFAULT_PAGE_SIZE,
    page: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  const columns = useMemo(() => checkinColumns, [])

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <FilterBar 
          filters={visualFilters} 
          onFilterChange={setVisualFilters} 
          config={CHECKIN_FILTER_CONFIG}
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
