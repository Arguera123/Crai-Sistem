import { Repository } from "typeorm";
import PostgresDataSource from "../config/db.config";
import { LoanLocker } from "../models/loan-locker";
import { ILoanLockerRepository } from "./interfaces/loan-locker-repository.interface";

export class LoanLockerRepository implements ILoanLockerRepository {
  private repo: Repository<LoanLocker>

  constructor () {
    this.repo = PostgresDataSource.getRepository(LoanLocker)
  }

  public save = async (loanLocker: LoanLocker): Promise<void> => {
    await this.repo.save(loanLocker)
  }
}