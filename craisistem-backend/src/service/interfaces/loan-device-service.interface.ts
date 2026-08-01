import { UserData } from "../../models/user.entity";
import { TLoanFilters } from "../../models/types/ISearchFilters";
import { PaginatedResponse } from "../../models/types/IPaginatedResponse";
import { TDeviceLoanResponse } from "../../models/types/ILoans";

export interface ILoanDeviceService {
  chargeLoan(
    librarian: UserData,
    userId: string,
    deviceId: number,
  ): Promise<void>;
  releaseLoan(librarian: UserData, loanId: string): Promise<void>;
  find(
    filters: TLoanFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<TDeviceLoanResponse>>;
}
