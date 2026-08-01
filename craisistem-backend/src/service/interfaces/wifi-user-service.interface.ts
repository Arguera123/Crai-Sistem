import { WifiUser } from "../../models/wifi-user.entity";
import { UserData } from "../../models/user.entity";
import { TWifiUserFilters } from "../../models/types/ISearchFilters";
import { TWifiUserResponse } from "../../models/types/IWifiUser";
import { PaginatedResponse } from "../../models/types/IPaginatedResponse";

export interface IWifiUserService {
  import(file: Express.Multer.File): Promise<{
    inserted: number;
    skipped: number;
    total: number;
    users: WifiUser[];
  }>;
  assignToUser(librarian: UserData, userId: string, wifiUserId: string): Promise<void>;
  find(
    filters: TWifiUserFilters,
    page?: number,
    limit?: number
  ): Promise<PaginatedResponse<TWifiUserResponse>>;
  delete(userId: string, wifiUserId: string): Promise<void>;
}