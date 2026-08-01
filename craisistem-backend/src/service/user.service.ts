import { UserData } from "../models/user.entity";
import { UserRepository } from "../repository/user.repository";
import { TRegisterForm, TUserResponse } from "../models/types/IUser";
import { toUserResponse } from "../helper/toUserResponse";
import { Roles } from "../utils/roles.constant";
import { RoleRepository } from "../repository/role.repository";
import { TUserFilters } from "../models/types/ISearchFilters";
import { toUserData } from "../helper/toUserData";
import { ConflictError } from "../error/conflict.error";
import { ErrorCodes } from "../error/errorCodes";
import { InternalServerError } from "../error/internal-server.error";
import { BadRequestError } from "../error/bad-request.error";
import { NotFoundError } from "../error/not-found.error";
import { IUserService } from "./interfaces/user-service.interface";
import { toPagination } from "../helper/toPagination";

export class UserService implements IUserService {
  constructor(
    private userRepository: UserRepository,
    private roleRepository: RoleRepository,
  ) {}

  public save = async (userData: TRegisterForm) => {
    const { id } = userData;
    const userExist = await this.userRepository.findByEmail(id);
    if (userExist) throw new ConflictError(ErrorCodes.USER.ALREADY_EXISTS);

    const userToSave = Object.assign(new UserData(), userData);
    await this.userRepository.save(userToSave);
  };

  public register = async (userData: TRegisterForm) => {
    const { id } = userData;
    const userExist = await this.userRepository.findById(id);
    if (userExist) throw new ConflictError(ErrorCodes.USER.ALREADY_EXISTS);

    const userRole = await this.roleRepository.findByName(Roles.USER);
    if (!userRole)
      throw new InternalServerError(ErrorCodes.SYSTEM.INTERNAL_ERROR);

    const userToSave = toUserData(userData);
    userToSave.roles = [userRole];
    userToSave.faculty = "N/A";

    await this.userRepository.save(userToSave);
  };

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
      pagination: toPagination(total, page, limit)
    };
  };

  public findById = async (id: string) => {
    const user = await this.userRepository.findById(id);

    return toUserResponse(user);
  };

  public assignRole = async (userId: string, roleName: string) => {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundError(ErrorCodes.USER.NOT_FOUND);

    const hasRole = user.roles.some((r) => r.name === roleName);

    const role = await this.roleRepository.findByName(roleName as Roles);
    if (!role) throw new NotFoundError(ErrorCodes.USER.ROLE_NOT_FOUND);

    user.roles.push(role);
    await this.userRepository.save(user);
  };

  public removeRole = async (userId: string, roleName: string) => {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundError(ErrorCodes.USER.NOT_FOUND);

    if (roleName === Roles.USER) {
      throw new BadRequestError(ErrorCodes.USER.ROLE_BASE_DELETION);
    }

    const initialCount = user.roles.length;
    user.roles = user.roles.filter((role) => role.name !== roleName);

    if (user.roles.length === initialCount) {
      throw new NotFoundError(ErrorCodes.USER.ROLE_NOT_OWNED)
    }

    await this.userRepository.save(user);
  };
}
