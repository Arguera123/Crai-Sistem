import { Repository } from "typeorm";
import { Complement } from "../models/complement.entity";
import PostgresDataSource from "../config/db.config";
import { IComplementRepository } from "./interfaces/complement-repository.interface";

export class ComplementRepository implements IComplementRepository {
  private repo: Repository<Complement>

  constructor() {
    this.repo = PostgresDataSource.getRepository(Complement)
  }

  public save = async (complement: Complement): Promise<void> => {
    await this.repo.save(complement)
  }
}