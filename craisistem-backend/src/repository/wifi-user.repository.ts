import { Repository } from "typeorm";
import { WifiUser } from "../models/wifi-user.entity";
import PostgresDataSource from "../config/db.config";
import { IwifiUserRepository as IWifiUserRepository } from "./interfaces/wifi-user-repository.interface";
import { TWifiUserFilters } from "../models/types/ISearchFilters";
import { SpecificationBuilder } from "./specifications/SpecificationBuilder";
import { WifiUserSpecs } from "./specifications/WifiUserSpecs";

export class WifiUserRepository implements IWifiUserRepository{
  private repo: Repository<WifiUser>

  constructor() {
    this.repo = PostgresDataSource.getRepository(WifiUser)
  }
  
  public save = async (wifiUser: WifiUser) => {
    return await this.repo.save(wifiUser)
  }

  public findById = async(id: string): Promise<WifiUser> => {
    return await this.repo.findOne({
      where: { id }
    })
  }

  public find = async(
    filters: TWifiUserFilters,
    page: number = 1, 
    limit: number = 10
  ): Promise<{
    data: WifiUser[], 
    total: number
  }> => {
    const { query, builder } = this.buildWifiLoanQuery(filters)
  
    builder.build(query);

    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();

    return { data, total }
  } 

  public findUnassigned = async (
    page?: number, 
    limit?:number
  ): Promise<{
    data: WifiUser[],
    total: number
  }> => {
    const [data, total] = await this.repo.findAndCount({
      skip: (page - 1) * limit,
      take: limit
    })

    return { data, total }
  }

  private buildWifiLoanQuery(filters: TWifiUserFilters) {
    const query = this.repo
      .createQueryBuilder("wifiUser")
      .leftJoinAndSelect("wifiUser.assignments", "assignments")
      .leftJoinAndSelect("assignments.user", "user")
      .leftJoinAndSelect("assignments.librarian", "librarian")

    const builder = new SpecificationBuilder<WifiUser>();

    builder
      .add(WifiUserSpecs.byWifiUserId(filters.wifiUserId))
      .add(WifiUserSpecs.byUserId(filters.userId))
      .add(WifiUserSpecs.byLibrarianId(filters.librarianId))
      .add(WifiUserSpecs.byCreationDate(filters.creationDate))
      .add(WifiUserSpecs.byExpirationDate(filters.expirationDate))

    return { query, builder }
  }
}