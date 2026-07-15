import createHttpError from "http-errors";
import { UserData } from "../models/user.entity";
import { Role } from "../models/role.entity";
import { UserRepository } from "../repository/user.repository";
import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/jwt";
import { Roles } from "../utils/roles.constant";

export class AuthMiddleware {
  private userRespository = new UserRepository(); 
  private PREFIX = "Bearer"

  public authentication = async (
    req : Request, 
    res : Response, 
    next : NextFunction
  ) => {
    try {
      const { authorization } = req.headers

      if(!authorization) throw createHttpError(401, "Usuario no autenticado")

      const [prefix, token] = authorization.split(" ")

      if(this.PREFIX !== prefix) throw createHttpError(401, "Usuario no autenticado")

      if(!token) throw createHttpError(401, "Usuario no autenticado")

      const payload = verifyJWT(token)

      if(!payload) throw createHttpError(401, "Usuario no autenticado D")

      const email = String(payload['email']);

      const user = await this.userRespository.findByEmail(email)

      if(!user) throw createHttpError(401, "Usuario no autenticado")

      // if(user.token !== token) throw createHttpError(401, "Usuario no autenticado")
      
      req.user_data = user 
      req.token = token

      next();
    } catch (err) {
      next(err)
    }
  }

  public authorization = (roleRequired: Roles) => {
    return (
      req: Request, 
      res: Response, 
      next: NextFunction
    ) => {
      try {
        const roles: Role[] = req.user_data.roles 
        const roleNames = roles.map(_r => _r.name)

        const isAuth = roleNames.includes(roleRequired)
        const isSysadmin = roleNames.includes(Roles.ADMIN);

        if(!isAuth && !isSysadmin) throw createHttpError(403, 'Usuario no autorizado')

        next()
      } catch (err) {
        next(err)
      }
    }
  }
}


