import { Repository } from "typeorm";
import { LoanDevice } from "../models/loan-device";
import PostgresDataSource from "../configs/db.config";

export class LoanDeviceRepository {
  private repo: Repository<LoanDevice>

  constructor () {
    this.repo = PostgresDataSource.getRepository(LoanDevice)
  }

  public save = async (loanDevice: LoanDevice): Promise<void> => {
    await this.repo.save(loanDevice)
  }
}