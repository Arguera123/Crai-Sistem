import { UserData } from "../models/user.entity";
import { UserRepository } from "../repository/user.repository";
import { TRegisterForm, TUserResponse } from "../models/types/IUser";
import createHttpError from "http-errors";
import { toUserResponse } from "../mappers/toUserResponse";
import { Roles } from "../utils/roles.constant";
import { RoleRepository } from "../repository/role.repository";
import { UserStates } from "../utils/states.constant";
import { TUserFilters } from "../models/types/ISearchFilters";
import { toUserData } from "../mappers/toUserData";

export class UserService {
  constructor(
    private userRepository: UserRepository,
    private roleRepository: RoleRepository,
  ) {}

  public save = async (userData: TRegisterForm) => {
    const { id } = userData;

    const userExist = await this.userRepository.findByEmail(id);

    if (userExist) throw createHttpError(409, "User already exist!");

    const userToSave = Object.assign(new UserData(), userData);

    await this.userRepository.save(userToSave);
  };

  public register = async (userData: TRegisterForm) => {
    const { id } = userData
    const userExist = await this.userRepository.findById(id)
    if (userExist) throw createHttpError(409, "Ya existe un usuario con ese id")

    const emailExist = await this.userRepository.findByEmail(userData.email)
    if (emailExist) throw createHttpError(409, "Ya existe un usuario con ese correo")

    const userRole = await this.roleRepository.findByName(Roles.USER)
    if(!userRole) throw createHttpError(500, 'Error interno del servidor')

    const userToSave = toUserData(userData)
    userToSave.roles = [userRole];
    userToSave.faculty = "N/A"
    userToSave.state = UserStates.ACTIVE

    await this.userRepository.save(userToSave);
  }

  public find = async (
    filters: TUserFilters,
    page: number = 1,
    limit: number = 10,
  ) => {
    const { data: users, total } = await this.userRepository.find(
      filters,
      page,
      limit,
    );

    const data: TUserResponse[] = users.map(toUserResponse);

    return {
      data,
      pagination: {
        total,
        limit,
        page,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      },
    };
  };

  public findById = async (id: string) => {
    const user = await this.userRepository.findById(id);
    if (!user) throw createHttpError(404, "Usuario no encontrado");

    return toUserResponse(user);
  };

  public assignRole = async (userId: string, roleName: string) => {
    const user = await this.userRepository.findById(userId);
    if (!user) throw createHttpError(404, "Usuario no encontrado");

    const hasRole = user.roles.some((r) => r.name === roleName);
    if (hasRole) throw createHttpError(409, "El usuario ya posee este rol");

    const role = await this.roleRepository.findByName(roleName as Roles);
    if (!role) throw createHttpError(404, "Rol no encontrado");

    user.roles.push(role);
    return await this.userRepository.save(user);
  };

  public removeRole = async (userId: string, roleName: string) => {
    const user = await this.userRepository.findById(userId);
    if (!user) throw createHttpError(404, "Usuario no encontrado");

    if (roleName === Roles.USER) {
      throw createHttpError(
        400,
        "No se puede eliminar el rol base del usuario",
      );
    }

    const initialCount = user.roles.length;
    user.roles = user.roles.filter((role) => role.name !== roleName);

    if (user.roles.length === initialCount) {
      throw createHttpError(404, "El usuario no posee este rol");
    }

    return await this.userRepository.save(user);
  };
}
