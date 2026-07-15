import { Repository } from "typeorm";
import { Checkin } from "../models/checkin.entity";
import PostgresDataSource from "../configs/db.config";
import { TCheckinFilters } from "../models/types/ISearchFilters";

export class CheckinRepository {
  private repo: Repository<Checkin>

  constructor() {
    this.repo = PostgresDataSource.getRepository(Checkin)
  }

  public save = async (checkin: Checkin) => {
    return await this.repo.save(checkin)
  }

  public findWithFilters = async (
    filters: TCheckinFilters,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: Checkin[]; total: number }> => {
    const query = this.repo
      .createQueryBuilder("checkin")
      .leftJoinAndSelect("checkin.user", "user")
    if (filters.date)
      query.andWhere("checkin.date = :date", { date: filters.date })
    if (filters.dateFrom)
      query.andWhere("checkin.date >= :dateFrom", { dateFrom: filters.dateFrom })
    if (filters.dateTo)
      query.andWhere("checkin.date <= :dateTo", { dateTo: filters.dateTo })
    if (filters.timeFrom)
      query.andWhere("checkin.time >= :timeFrom", { timeFrom: filters.timeFrom })
    if (filters.timeTo)
      query.andWhere("checkin.time <= :timeTo", { timeTo: filters.timeTo })

    query.skip((page - 1) * limit).take(limit)

    const [data, total] = await query.getManyAndCount();

    return { data, total }
  }
}