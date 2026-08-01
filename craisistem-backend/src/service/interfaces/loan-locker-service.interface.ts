import { UserData } from "../../models/user.entity";
import { TLoanFilters } from "../../models/types/ISearchFilters";
import { PaginatedResponse } from "../../models/types/IPaginatedResponse";
import { TLockerLoanResponse } from "../../models/types/ILoans";

export interface ILoanLockerService {
  chargeLoan(
    librarian: UserData,
    userId: string,
    lockerId: number,
  ): Promise<void>;
  releaseLoan(librarian: UserData, loanId: string): Promise<void>;
  find(
    filters: TLoanFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<TLockerLoanResponse>>;
}
