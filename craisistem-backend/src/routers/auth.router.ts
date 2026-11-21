import { Router } from "express";
import passport from "passport";
import { AuthController } from "../controllers/auth.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { UserRepository } from "../repository/user.repository";
import { AuthService } from "../services/auth.service";
import { RoleRepository } from "../repository/role.repository";
import { validathor } from "../middlewares/validathor.middleware";
import { loginValidator, registerValidator } from "../validators/auth.validator";
import { Roles } from "../utils/roles.constant";

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

// Crea un usuario con rol ADMIN: solo otro administrador puede hacerlo.
authRouter.post(
  "/register",
  authMiddleware.authentication,
  authMiddleware.authorization(Roles.ADMIN),
  registerValidator,
  validathor,
  authController.register
);

authRouter.post("/login", loginValidator, validathor, authController.login);

authRouter.get("/whoami", authMiddleware.authentication, authController.whoami);