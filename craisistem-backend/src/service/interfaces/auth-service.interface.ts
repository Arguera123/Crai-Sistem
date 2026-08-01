import { Request } from "express";
import { UserData } from "../../models/user.entity";
import { MicrosoftAuthResult, TLoginForm, TRegisterForm, TWhoamiResponse } from "../../models/types/IUser";

export interface IAuthService {
  register(userData: TRegisterForm): Promise<void>;
  login(userData: TLoginForm): Promise<string>;
  whoami(req: Request): Promise<TWhoamiResponse>;
  processMicrosoftLogin(user: UserData): MicrosoftAuthResult;
}