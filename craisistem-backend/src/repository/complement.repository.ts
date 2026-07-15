import { Repository } from "typeorm";
import { Complement } from "../models/complement.entity";
import PostgresDataSource from "../configs/db.config";

export class ComplementRepository {
  private repo: Repository<Complement>

  constructor() {
    this.repo = PostgresDataSource.getRepository(Complement)
  }

  public save = async (complement: Complement): Promise<void> => {
    await this.repo.save(complement)
  }
}