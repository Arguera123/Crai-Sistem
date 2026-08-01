import { Repository } from "typeorm";
import PostgresDataSource from "../config/db.config";
import { LoanRelease } from "../models/loan-release.entity";
import { ILoanReleaseRepository } from "./interfaces/loan-release-repository";

export class LoanReleaseRepository implements ILoanReleaseRepository {
  private repo: Repository<LoanRelease>

  constructor () {
    this.repo = PostgresDataSource.getRepository(LoanRelease)
  }

  public save = async (release: LoanRelease): Promise<void> => {
    await this.repo.save(release)
  }
}