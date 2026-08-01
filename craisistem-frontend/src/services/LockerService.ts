import api from "../config/axios";
import type { ILocker } from "../types/loker";
import type { TPaginatedResponse } from "../types/pagination";

export const getLockersService = async () => {
  const res = await api.get<TPaginatedResponse<ILocker>>("/locker", {
    params: {
      page: 1,
      limit: 140,
    },
  });

  return res.data
};