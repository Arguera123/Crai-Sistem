import { Repository } from "typeorm";
import PostgresDataSource from "../configs/db.config";
import { LoanRelease } from "../models/loan-release.entity";

export class LoanReleaseRepository {
  private repo: Repository<LoanRelease>

  constructor () {
    this.repo = PostgresDataSource.getRepository(LoanRelease)
  }

  public save = async (release: LoanRelease): Promise<void> => {
    await this.repo.save(release)
  }
}