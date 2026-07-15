import { Repository } from "typeorm";
import PostgresDataSource from "../configs/db.config";
import { LoanLocker } from "../models/loan-locker";

export class LoanLockerRepository {
  private repo: Repository<LoanLocker>

  constructor () {
    this.repo = PostgresDataSource.getRepository(LoanLocker)
  }

  public save = async (loanLocker: LoanLocker): Promise<void> => {
    await this.repo.save(loanLocker)
  }
}