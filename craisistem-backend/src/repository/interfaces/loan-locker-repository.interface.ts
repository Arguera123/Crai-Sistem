import { LoanLocker } from "../../models/loan-locker";

export interface ILoanLockerRepository {
  save(loanLocker: LoanLocker): Promise<void>;
}