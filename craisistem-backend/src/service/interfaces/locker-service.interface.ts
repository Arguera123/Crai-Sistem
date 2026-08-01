import { Locker } from "../../models/locker.entity";
import { PaginatedResponse } from "../../models/types/IPaginatedResponse";

export interface ILockerService {
  save(num: number): Promise<void>;
  find(
    page?: number,
    limit?: number
  ): Promise<PaginatedResponse<Locker>>;
  findById(id: string): Promise<Locker | null>;
}