import { Role } from "../models/role.entity";
import { UserRepository } from "../repository/user.repository";
import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/jwt";
import { Roles } from "../utils/roles.constant";
import { UnauthorizedError } from "../error/unauthorized.error";
import { ForbiddenError } from "../error/forbidden.error";
import { ErrorCodes } from "../error/errorCodes";

export class AuthMiddleware {
  private userRespository = new UserRepository(); 
  private PREFIX = "Bearer";

  public authentication = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { authorization } = req.headers;
      if(!authorization) throw new UnauthorizedError(ErrorCodes.AUTH.UNAUTHENTICATED);

      const [prefix, token] = authorization.split(" ");
      if(this.PREFIX !== prefix || !token) throw new UnauthorizedError(ErrorCodes.AUTH.UNAUTHENTICATED);

      const payload = verifyJWT(token);
      if(!payload) throw new UnauthorizedError(ErrorCodes.AUTH.UNAUTHENTICATED);

      const email = String(payload['email']);
      const user = await this.userRespository.findByEmail(email);
      if(!user) throw new UnauthorizedError(ErrorCodes.AUTH.UNAUTHENTICATED);
      
      req.user_data = user; 
      req.token = token;
      next();
    } catch (err) {
      next(err);
    }
  }

  public authorization = (roleRequired: Roles) => {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const roles: Role[] = req.user_data.roles;
        const roleNames = roles.map(_r => _r.name);

        const isAuth = roleNames.includes(roleRequired);
        const isSysadmin = roleNames.includes(Roles.ADMIN);

        if(!isAuth && !isSysadmin) throw new ForbiddenError(ErrorCodes.AUTH.UNAUTHORIZED);

        next();
      } catch (err) {
        next(err);
      }
    }
  }
}