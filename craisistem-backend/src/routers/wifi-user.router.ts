import { Router } from "express";
import { WifiUserRepository } from "../repository/wifi-user.repository";
import { WifiUserService } from "../services/wifi-user.service";
import { WifiUserController } from "../controllers/wifi-user.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { uploadCSV } from "../middlewares/multer.middleware";
import { UserRepository } from "../repository/user.repository";
import { WifiAssignmentRepository } from "../repository/wifi-assignment.repository";
import { Roles } from "../utils/roles.constant";
import { validatePagination } from "../validators/comon-validator";
import { validathor } from "../middlewares/validathor.middleware";
import { wifiAssignValidator } from "../validators/loan.validator";

const wifiUserRepository = new WifiUserRepository
const userRepository = new UserRepository
const wifiAssignmentRepository = new WifiAssignmentRepository
const wifiUserService = new WifiUserService(wifiUserRepository, wifiAssignmentRepository, userRepository)

const wifiUserController = new WifiUserController(wifiUserService)
const authMiddleware = new AuthMiddleware

export const wifiUserRouter = Router()

wifiUserRouter.post(
  '/import',
  authMiddleware.authentication,
  authMiddleware.authorization(Roles.LIBRARIAN),
  uploadCSV.single('file'),
  wifiUserController.importFromCsv
)

wifiUserRouter.get(
  '/',
  authMiddleware.authentication,
  authMiddleware.authorization(Roles.LIBRARIAN),
  validatePagination,
  validathor,
  wifiUserController.find
)

wifiUserRouter.post(
  '/assign',
  authMiddleware.authentication,
  authMiddleware.authorization(Roles.LIBRARIAN),
  wifiAssignValidator,
  validathor,
  wifiUserController.assingToUser
)

