import { Repository } from "typeorm"
import PostgresDataSource from "../config/db.config"
import { UserData } from "../models/user.entity"
import { IUserRepository } from "./interfaces/user-repository.interface"
import { TUserFilters } from "../models/types/ISearchFilters"
import { SpecificationBuilder } from "./specifications/SpecificationBuilder"
import { UserDataSpecs } from "./specifications/UserSpecs"

export class UserRepository implements IUserRepository{
  private repo: Repository<UserData>

  constructor() {
    this.repo = PostgresDataSource.getRepository(UserData)
  }

  public save = async (user: UserData): Promise<void> => {
    await this.repo.save(user)
  }

  public findById = async (id: string): Promise<UserData> => {
    return await this.repo.findOne({
      where: { id },
      relations: ['roles']
    })
  }

  public findByEmail = async (email: string): Promise<UserData> => {
    return await this.repo.findOne({  
      where: { email },
      relations: ['roles']
    })
  }

  public find = async (
    filters: TUserFilters,
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: UserData[], total: number }> => {
    const query = this.repo.createQueryBuilder("user")

    query.leftJoinAndSelect("user.roles", "role")

    const builder = new SpecificationBuilder<UserData>();

    builder
      .add(UserDataSpecs.byId(filters.id))
      .add(UserDataSpecs.byFirstName(filters.firstName))
      .add(UserDataSpecs.byLastName(filters.lastName))
      .add(UserDataSpecs.byEmail(filters.email))
      .add(UserDataSpecs.byType(filters.type))
      .add(UserDataSpecs.byFaculty(filters.faculty))
      .add(UserDataSpecs.byState(filters.state))
      .add(UserDataSpecs.byOrder())

    builder.build(query);

    const skip = (page - 1) * limit;
    query.skip(skip).take(limit);

    const [data, total] = await query.getManyAndCount();

    return { data, total }
  }
}