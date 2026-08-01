import { Repository } from "typeorm";
import { LoanDevice } from "../models/loan-device";
import PostgresDataSource from "../config/db.config";
import { ILoanDeviceRepository } from "./interfaces/loan-device-repository.interface";

export class LoanDeviceRepository implements ILoanDeviceRepository {
  private repo: Repository<LoanDevice>

  constructor () {
    this.repo = PostgresDataSource.getRepository(LoanDevice)
  }

  public save = async (loanDevice: LoanDevice): Promise<void> => {
    await this.repo.save(loanDevice)
  }
}