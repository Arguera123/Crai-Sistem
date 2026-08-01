import { Repository } from "typeorm";
import { LoanCharge } from "../models/loan-charge.entity";
import PostgresDataSource from "../config/db.config";
import { ILoanChargeRepository } from "./interfaces/loan-charge-repository.interface";

export class LoanChargeRepository implements ILoanChargeRepository {
  private repo: Repository<LoanCharge>

  constructor() {
    this.repo = PostgresDataSource.getRepository(LoanCharge)
  }

  public save = async(charge: LoanCharge): Promise<void> => {
    await this.repo.save(charge);
  }
}