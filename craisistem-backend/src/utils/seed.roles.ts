import { Role } from "../models/role.entity";
import PostgresDataSource from "../configs/db.config";
import { Roles } from "./roles.constant";

export const seedRoles = async () => {
  const roleRepo = PostgresDataSource.getRepository(Role);

  const defaultRoles = [
    { name: Roles.ADMIN },
    { name: Roles.USER },
    { name: Roles.LEARNING_CENTER },
    { name: Roles.RECEPTION },
    { name: Roles.LIBRARIAN }
  ] as const;

  for (const role of defaultRoles) {
    await roleRepo.upsert(role, ["name"]); 
  }

  console.log("Roles seeded");
};
