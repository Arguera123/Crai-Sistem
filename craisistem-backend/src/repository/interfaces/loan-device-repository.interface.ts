import { LoanDevice } from "../../models/loan-device";

export interface ILoanDeviceRepository {
  save(loanDevice: LoanDevice): Promise<void>;
}