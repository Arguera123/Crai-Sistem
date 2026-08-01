import { Loan } from "../../models/loan.entity";
import { TLoanFilters } from "../../models/types/ISearchFilters";

export interface ILoanRepository {
  save(loan: Loan): Promise<Loan>;
  findById(id: string): Promise<Loan | null>;
  findActiveLoans(): Promise<Loan[]>;
  findDeviceLoans(
    filters: TLoanFilters,
    page?: number,
    limit?: number,
  ): Promise<{ data: Loan[]; total: number }>;
  findLockerLoans(
    filters: TLoanFilters,
    page?: number,
    limit?: number,
  ): Promise<{ data: Loan[]; total: number }>;
  findActiveDeviceLoansByUser(userId: string): Promise<Loan[]>;
  findActiveLockerLoansByUser(userId: string): Promise<Loan[]>;
}