export type TPaginatedResponse<T> = {
  data: T[];
  pagination: TPagination
};

export type TPagination = {
  total: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}