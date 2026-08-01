import { TCheckinFilters } from "../../models/types/ISearchFilters";
import { TCheckinResponse } from "../../models/types/ICheckin";
import { PaginatedResponse } from "../../models/types/IPaginatedResponse";

export interface ICheckinService {
  save(userId: string): Promise<TCheckinResponse>;
  find(
    filters: TCheckinFilters,
    page?: number,
    limit?: number,
  ): Promise<PaginatedResponse<TCheckinResponse>>;
}
