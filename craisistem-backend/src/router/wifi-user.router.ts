import { Router } from "express";
import { WifiUserRepository } from "../repository/wifi-user.repository";
import { WifiUserService } from "../service/wifi-user.service";
import { WifiUserController } from "../controller/wifi-user.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { uploadCSV } from "../middleware/multer.middleware";
import { UserRepository } from "../repository/user.repository";
import { WifiAssignment } from "../models/wifi-assignment.entity";
import { WifiAssignmentRepository } from "../repository/wifi-assignment.repository";
import { Roles } from "../utils/roles.constant";
import { validatePagination } from "../validator/comon-validator";
import { validathor } from "../middleware/validathor.middleware";

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
  wifiUserController.assingToUser
)

