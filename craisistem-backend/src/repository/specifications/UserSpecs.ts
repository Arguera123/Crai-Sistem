import { SelectQueryBuilder } from "typeorm";
import { UserData } from "../../models/user.entity";

export const UserDataSpecs = {
  byId: (id?: string) => (query: SelectQueryBuilder<UserData>) => {
    if (id) query.andWhere("user.id = :id", { id });
  },

  byFirstName: (firstName?: string) => 
    (query: SelectQueryBuilder<UserData>) => {
      if (firstName)
        query.andWhere("user.firstName ILIKE :firstName", {
          firstName: `%${firstName}%`,
        });
    },

  byLastName: (lastName?: string) => 
    (query: SelectQueryBuilder<UserData>) => {
      if (lastName)
        query.andWhere("user.lastName ILIKE :lastName", {
          lastName: `%${lastName}%`,
        });
    },

  byEmail: (email?: string) => 
    (query: SelectQueryBuilder<UserData>) => {
      if (email)
        query.andWhere("user.email ILIKE :email", {
          email: `%${email}%`,
        });
    },

  byType: (type?: string) => 
    (query: SelectQueryBuilder<UserData>) => {
      if (type)
        query.andWhere("user.type = :type", { type });
    },

  byFaculty: (faculty?: string) =>
    (query: SelectQueryBuilder<UserData>) => {
      if (faculty)
        query.andWhere("user.faculty ILIKE :faculty", {
          faculty: `%${faculty}%`,
        });
    },

  byState: (state?: string) => 
    (query: SelectQueryBuilder<UserData>) => {
      if (state)
        query.andWhere("user.state = :state", { state });
    },

  byRoleId: (roleId?: string) =>
    (query: SelectQueryBuilder<UserData>) => {
      if (roleId)
        query.andWhere("roles.id = :roleId", { roleId });
    },

  byRoleName: (roleName?: string) =>
    (query: SelectQueryBuilder<UserData>) => {
      if (roleName)
        query.andWhere("roles.name ILIKE :roleName", {
          roleName: `%${roleName}%`
        });
    },

  byOrder:
    (order?: string) =>
    (query: SelectQueryBuilder<UserData>) => {
      if (!order) return;

      const direction = order.startsWith("-") ? "DESC" : "ASC";
      const field = order.replace("-", "");

      const orderMap: Record<string, string> = {
        id: "user.id",
        firstName: "user.firstName",
        lastName: "user.lastName",
        email: "user.email",
        type: "user.type",
        faculty: "user.faculty",
        expirationDate: "user.expirationDate",
        active: "user.active",
      };

      const column = orderMap[field];
      if (!column) return;

      query.orderBy(column, direction);
    },
};
