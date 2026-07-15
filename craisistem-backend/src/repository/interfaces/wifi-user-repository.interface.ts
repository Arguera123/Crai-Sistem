import { TWifiUserFilters } from "../../models/types/ISearchFilters";
import { WifiUser } from "../../models/wifi-user.entity";

export interface IwifiUserRepository {
  save(wifiUser: WifiUser): void,
  findById(id: string): Promise<WifiUser>,
  find(
    filters?: TWifiUserFilters,
    page?: number, 
    limit?: number
  ): Promise<{ data: WifiUser[], total: number }>,
  findUnassigned(
    page?: number, 
    limit?: number
  ): Promise<{data: WifiUser[], total: number}>
}