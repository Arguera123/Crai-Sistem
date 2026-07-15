import PostgresDataSource from "../configs/db.config";
import { UserData } from "../models/user.entity";
import { Role } from "../models/role.entity";
import { Roles } from "./roles.constant";
import { UserStates } from "./states.constant";
import { UserType } from "./user-type.constants";

export const seedAdminUser = async () => {
  const userRepo = PostgresDataSource.getRepository(UserData);
  const roleRepo = PostgresDataSource.getRepository(Role);

  const adminRole = await roleRepo.findOneBy({ name: Roles.ADMIN });
  if (!adminRole) {
    throw new Error('El rol admin no existe. Por favor seedéalo primero.');
  }

  const adminUser = userRepo.create({
    id: "admin01",
    firstName: "Admin",
    lastName: "User",
    email: "admin@example.com",
    gender: "other",
    type: UserType.EMPLOYEE,
    faculty: "administration",
    token: null,
    state: UserStates.ACTIVE,
    expirationDate: new Date(), 
    roles: [adminRole],
  });

  await userRepo.save(adminUser);

  console.log("Usuario admin seed creado o actualizado");
};
