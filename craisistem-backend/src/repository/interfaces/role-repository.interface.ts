import { Role } from "../../models/role.entity";
import { Roles } from "../../utils/roles.constant";

export interface IRoleRepository {
  findByName(name: Roles): Promise<Role>
}