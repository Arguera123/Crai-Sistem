import { Repository } from "typeorm";
import { LoanCharge } from "../models/loan-charge.entity";
import PostgresDataSource from "../configs/db.config";

export class LoanChargeRepository {
  private repo: Repository<LoanCharge>

  constructor() {
    this.repo = PostgresDataSource.getRepository(LoanCharge)
  }

  public save = async(charge: LoanCharge): Promise<void> => {
    await this.repo.save(charge);
  }
}