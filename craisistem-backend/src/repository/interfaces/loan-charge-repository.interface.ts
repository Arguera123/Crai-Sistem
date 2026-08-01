import { LoanCharge } from "../../models/loan-charge.entity";

export interface ILoanChargeRepository {
  save(charge: LoanCharge): Promise<void>;
}