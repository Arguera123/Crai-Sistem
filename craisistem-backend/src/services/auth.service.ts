import createHttpError from "http-errors";
import { Request } from "express";
import { UserData } from "../models/user.entity";
import {
  MicrosoftAuthResult,
  TLoginForm,
  TRegisterForm,
  TWhoamiResponse,
} from "../models/types/IUser";
import { generateJWT } from "../utils/jwt";
import { Role } from "../models/role.entity";
import { IUserRepository } from "../repository/interfaces/user-repository.interface";
import { IRoleRepository } from "../repository/interfaces/role-repository.interface";
import { Roles } from "../utils/roles.constant";
import { toUserData } from "../mappers/toUserData";

export class AuthService {
  constructor(
    private userRepository: IUserRepository,
    private roleRepository: IRoleRepository,
  ) {}

  public register = async (userData: TRegisterForm) => {
    const { id } = userData;

    const userExist = await this.userRepository.findById(id);

    if (userExist) throw createHttpError(409, "Ya existe un usuario con ese id");

    const emailExist = await this.userRepository.findByEmail(userData.email);
    if (emailExist) throw createHttpError(409, "Ya existe un usuario con ese correo");

    const userRole = await this.roleRepository.findByName(Roles.ADMIN);

    if (!userRole) throw createHttpError(500, "Error interno del servidor");

    const userToSave = toUserData(userData);
    userToSave.roles = [userRole];
    userToSave.faculty = "N/A";

    await this.userRepository.save(userToSave);
  };

  public login = async (userData: TLoginForm): Promise<string> => {
    if (process.env.ENABLE_EMAIL_LOGIN === "false") {
      throw createHttpError(403, "El inicio de sesion por correo esta deshabilitado. Use su cuenta Microsoft.");
    }

    const email = userData?.email?.trim();

    const user = await this.userRepository.findByEmail(email);

    if (!user) throw createHttpError(401, "Correo no registrado");

    const roleNames = (user.roles ?? []).map((r) => r.name.toLowerCase());
    if (!this.hasFunctionalRole(roleNames)) {
      throw createHttpError(403, "El usuario no tiene permisos para acceder al sistema");
    }

    const token = generateJWT({ email: user.email, sub: user.id });

    if (!token) throw createHttpError();

    return token;
  };

  public whoami = async (req: Request): Promise<TWhoamiResponse> => {
    const user = req.user_data;

    const roles: Role[] = user.roles ?? [];
    const roleNames = roles.map((_r) => _r.name);

    const userResponse: TWhoamiResponse = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      type: user.type,
      faculty: user.faculty,
      roles: roleNames,
    };

    return userResponse;
  };

  private hasFunctionalRole = (roleNames: string[]): boolean => {
    return roleNames.some((r) => r.toLowerCase() !== Roles.USER.toLowerCase());
  };

  public processMicrosoftLogin = (user: UserData): MicrosoftAuthResult => {
    const roleNames = user.roles.map((r) => r.name.toLowerCase());

    if (!this.hasFunctionalRole(roleNames)) {
      return { error: "El usuario no tiene permisos para acceder al sistema" };
    }

    const token = generateJWT({
      sub: user.id,
      email: user.email,
    });

    return { token };
  };
}
