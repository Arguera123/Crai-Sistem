import { LoanRelease } from "../../models/loan-release.entity";

export interface ILoanReleaseRepository {
  save(release: LoanRelease): Promise<void>;
}