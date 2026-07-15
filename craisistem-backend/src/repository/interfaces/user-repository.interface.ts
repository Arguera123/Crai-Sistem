import { TUserFilters } from "../../models/types/ISearchFilters"
import { UserData } from "../../models/user.entity"

export interface IUserRepository {
  save(user : UserData): Promise<void>,
  findById(id : string): Promise<UserData>,
  findByEmail(email : string): Promise<UserData>,
  find(
    filters: TUserFilters,
    page?: number,
    limit?: number
  ): Promise<{ data: UserData[], total: number }>
}