import { useCallback, useMemo, useState } from "react";
import type { UseQueryResult } from "@tanstack/react-query";
import { useDebounce } from "./useDebounce";
import type { TPagination } from "../types/pagination";

interface ServerResponse<TData> {
  data: TData[];
  pagination: TPagination;
}

interface UseServerTableOptions<TFilters> {
  defaultPageSize?: number;
  initialFilters?: TFilters;
  debounceMs?: number;
}

type TQueryParams<TFilters> = Partial<TFilters> & {
  page: number;
  limit: number;
};

export type TServerTableState<TData = any, TFilters = any> = {
  visualFilters: TFilters;
  setVisualFilters: (newFilters: TFilters) => void;
  pagination: { pageIndex: number; pageSize: number }; 
  setPagination: React.Dispatch<React.SetStateAction<{ pageIndex: number; pageSize: number }>>;
  filters: TQueryParams<TFilters>;
  data: TData[];
  paginationMeta: TPagination; 
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
};

export function useServerTable<TData, TFilters extends Record<string, any>>(
  useFetchHook: (params: any) => UseQueryResult<ServerResponse<TData>, unknown>,
  options: UseServerTableOptions<TFilters> = {}
): TServerTableState<TData, TFilters> { 
  const {
    defaultPageSize = 20,
    initialFilters = {} as TFilters,
    debounceMs = 500,
  } = options;

  const [visualFilters, setVisualFiltersState] = useState<TFilters>(initialFilters);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });

  const debouncedFilters = useDebounce(visualFilters, debounceMs);

  const setVisualFilters = useCallback((newFilters: TFilters) => {
    setVisualFiltersState(newFilters);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const filters = useMemo((): TQueryParams<TFilters> => {
    const cleaned = Object.fromEntries(
      Object.entries(debouncedFilters).filter(
        ([, v]) => v !== "" && v !== undefined && v !== null
      )
    ) as Partial<TFilters>;

    return {
      ...cleaned,
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    };
  }, [debouncedFilters, pagination.pageIndex, pagination.pageSize]);

  const query = useFetchHook(filters);
  const { data: response, isLoading, isFetching, isError, error, refetch } = query;

  const data = response?.data ?? [];
  const paginationMeta: TPagination = response?.pagination ?? {
    total: 0,
    limit: pagination.pageSize,
    page: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  return {
    visualFilters,
    setVisualFilters,
    pagination,
    setPagination,
    filters,
    data,
    paginationMeta,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
}