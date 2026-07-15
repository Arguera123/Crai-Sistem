import { useMemo, useState } from "react";
import { DataTable } from "./Tables/DataTable";
import { PaginationControls } from "./Tables/PaginationControls";
import type { TLoanFilters } from "../types/filters";
import type { ColumnDef } from "@tanstack/react-table";

interface LoanTableBaseProps<T> {
  useLoanQuery: (filters: TLoanFilters) => any;
  columns: ColumnDef<T, any>[];
}

const DEFAULT_PAGE_SIZE = 20

export function LoanTableBase<T>({
  useLoanQuery,
  columns,
}: LoanTableBaseProps<T>) {
  const [searchFilters] = useState<
    Omit<TLoanFilters, "page" | "limit">
  >({});

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const filters = useMemo(
    () => ({
      ...searchFilters,
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    }),
    [searchFilters, pagination]
  );

  const loanQuery = useLoanQuery(filters);

  const data = loanQuery.data?.data ?? [];
  const paginationMeta = loanQuery.data?.pagination ?? {
    total: 0,
    limit: DEFAULT_PAGE_SIZE,
    page: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  return (
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
  );
}
