import { Router } from "express";
import { UserService } from "../service/user.service";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { UserDataController } from "../controller/user.controller";
import { UserRepository } from "../repository/user.repository";
import { Roles } from "../utils/roles.constant";
import { RoleRepository } from "../repository/role.repository";
import { roleActionValidator, userFiltersValidator } from "../validator/user.validator";
import { validathor } from "../middleware/validathor.middleware";
import { validatePagination } from "../validator/comon-validator";

const userRepository = new UserRepository
const roleRepository = new RoleRepository
const userService = new UserService(userRepository, roleRepository)

const userController = new UserDataController(userService)
const authMiddleware = new AuthMiddleware()

export const userRouter = Router()

userRouter.get(
  '/',
  authMiddleware.authentication,
  authMiddleware.authorization(Roles.LIBRARIAN),
  validatePagination,
  userFiltersValidator,
  validathor,
  userController.find
)

userRouter.get(
  '/:identifier',
  authMiddleware.authentication,
  authMiddleware.authorization(Roles.LEARNING_CENTER),
  userController.findById
)

userRouter.patch(
  '/:identifier/roles',
  authMiddleware.authentication,
  authMiddleware.authorization(Roles.ADMIN),
  roleActionValidator,
  validathor,
  userController.assignRoles
)

userRouter.post(
  '/',
  authMiddleware.authentication,
  authMiddleware.authorization(Roles.LIBRARIAN),
  userController.register
)

userRouter.delete(
  '/:identifier/roles',
  authMiddleware.authentication,
  authMiddleware.authorization(Roles.ADMIN),
  roleActionValidator,
  validathor,
  userController.removeRoles
)

userRouter.patch(
  "/manual-fetch",
  authMiddleware.authentication,
  authMiddleware.authorization(Roles.ADMIN),
  userController.manualFetch
)
