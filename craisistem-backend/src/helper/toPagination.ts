import { IPagination } from "../models/types/IPaginatedResponse";

export const toPagination = (
  total: number,
  page: number,
  limit: number
): IPagination => {
  return {
    total,
    limit,
    page,
    totalPages: Math.ceil(total / limit),
    hasNextPage: page * limit < total,
    hasPreviousPage: page > 1,
  };
};