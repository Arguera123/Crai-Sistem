import { Repository } from "typeorm";
import PostgresDataSource from "../configs/db.config";
import { Locker } from "../models/locker.entity";
import { ILockerRepository } from "./interfaces/locker-repository.interface";

export class LockerRepository implements ILockerRepository{
  private repo: Repository<Locker>

  constructor() {
    this.repo = PostgresDataSource.getRepository(Locker)
  }

  public save = async (locker: Locker) => {
    return this.repo.save(locker)
  }

  public findById = async (id: number): Promise<Locker> => {
    return this.repo.findOne({
      where: { id },
    })
  }

  public find = async (
    page: number = 1,
    limit: number = 10
  ): Promise<{
      data: Locker[];
      total: number;
  }> => {
    const [data, total] = await this.repo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: {
        id: "ASC"
      }
    })
    return { data, total }
  }
}