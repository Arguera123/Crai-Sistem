import { Loan } from "../../models/loan.entity";
import { TLoanFilters, TLockerLoanFilters } from "../../models/types/ISearchFilters";

export interface ILoanRepository {
  save(loan: Loan): Promise<Loan>
  findDeviceLoans(
    filter: TLoanFilters,
    page?: number,
    limit?: number
  ): Promise<{ data: Loan[]; total: number }>
  findLockerLoans(
    filter: TLoanFilters,
    page?: number,
    limit?: number
  ): Promise<{ data: Loan[]; total: number }>
}