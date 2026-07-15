import { In, Repository } from "typeorm";
import PostgresDataSource from "../configs/db.config";
import { Role } from "../models/role.entity";
import { IRoleRepository } from "./interfaces/role-repository.interface";
import { Roles } from "../utils/roles.constant";

export class RoleRepository implements IRoleRepository {
  private repo: Repository<Role>

  constructor() {
    this.repo = PostgresDataSource.getRepository(Role)
  }

  public findByName = async (name: Roles): Promise<Role> => {
    return await this.repo.findOne({
      where: { name }
    })
  }

  public findByNames = async (names: Roles[]) => {
    return await this.repo.find({
      where: { name: In(names) }
    })
  }
}