import { NextFunction, Response, Request } from "express";
import {
  TLoginForm,
  TRegisterForm,
  TWhoamiResponse,
} from "../models/types/IUser";
import passport from "passport";
import { IAuthService } from "../service/interfaces/auth-service.interface";

export class AuthController {
  constructor(private authService: IAuthService) {}

  private FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user: TRegisterForm = req.body;
      await this.authService.register(user);
      res.status(201).json({ message: "User registered" });
    } catch (err) {
      next(err);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loginForm: TLoginForm = req.body;
      const token = await this.authService.login(loginForm);
      res.status(200).json({ token });
    } catch (err) {
      next(err);
    }
  };

  public whoami = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const whoami: TWhoamiResponse = await this.authService.whoami(req);
      res.status(200).json(whoami);
    } catch (err) {
      next(err);
    }
  };

  private redirectToLogin = (res: Response, params: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    return res.redirect(`${this.FRONTEND_URL}/login?${query}`);
  };

  public microsoftCallback = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    passport.authenticate(
      "auth-microsoft",
      { session: false },
      (err: any, user: any, info: any) => {
        if (err || !user) {
          const errorMessage =
            info?.message || "Error en la autenticación institucional";
          return this.redirectToLogin(res, { error: errorMessage });
        }

        const { token, error } = this.authService.processMicrosoftLogin(user);

        if (error) {
          return this.redirectToLogin(res, { error });
        }

        return this.redirectToLogin(res, { token: token! });
      },
    )(req, res, next);
  };
}
