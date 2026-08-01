import { Router } from "express";
import passport from "passport";
import { AuthController } from "../controller/auth.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { UserRepository } from "../repository/user.repository";
import { AuthService } from "../service/auth.service";
import { RoleRepository } from "../repository/role.repository";
import "../config/microsoft.strategy";

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