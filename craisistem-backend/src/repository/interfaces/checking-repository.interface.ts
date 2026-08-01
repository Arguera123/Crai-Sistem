import { Checkin } from "../../models/checkin.entity";
import { TCheckinFilters } from "../../models/types/ISearchFilters";

export interface ICheckinRepository {
  save(checkin: Checkin): Promise<Checkin>;
  findWithFilters(
    filters: TCheckinFilters,
    page?: number,
    limit?: number
  ): Promise<{ data: Checkin[]; total: number }>;
}