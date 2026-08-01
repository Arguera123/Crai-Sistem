import { TRegisterForm, TUserResponse } from "../../models/types/IUser";
import { TUserFilters } from "../../models/types/ISearchFilters";
import { UserData } from "../../models/user.entity";
import { PaginatedResponse } from "../../models/types/IPaginatedResponse";

export interface IUserService {
  save(userData: TRegisterForm): Promise<void>;
  register(userData: TRegisterForm): Promise<void>;
  find(
    filters: TUserFilters,
    page?: number,
    limit?: number
  ): Promise<PaginatedResponse<TUserResponse>>;
  findById(id: string): Promise<TUserResponse>;
  assignRole(userId: string, roleName: string): Promise<void>;
  removeRole(userId: string, roleName: string): Promise<void>;
}