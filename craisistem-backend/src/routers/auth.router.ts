import { Router } from "express";
import passport from "passport";
import { AuthController } from "../controllers/auth.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { UserRepository } from "../repository/user.repository";
import { AuthService } from "../services/auth.service";
import { RoleRepository } from "../repository/role.repository";
import { generateJWT } from "../utils/jwt"; 
import { UserData } from "../models/user.entity";

import "../configs/microsoft.strategy";

const userRepository = new UserRepository();
const roleRepository = new RoleRepository();
const authService = new AuthService(userRepository, roleRepository);
const authController = new AuthController(authService);
const authMiddleware = new AuthMiddleware();

export const authRouter = Router();

authRouter.get(
  "/microsoft",
  passport.authenticate("auth-microsoft", {
    prompt: "select_account",
    session: false
  })
);

authRouter.get("/microsoft/callback", 
  authController.microsoftCallback
);

// authRouter.post("/register", authController.register);
// authRouter.post("/login", authController.login);

authRouter.get("/whoami", authMiddleware.authentication, authController.whoami);