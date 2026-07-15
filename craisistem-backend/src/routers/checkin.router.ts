import { Router } from "express";
import { CheckinController } from "../controllers/checkin.controller";
import { CheckinRepository } from "../repository/checkin.repository";
import { UserRepository } from "../repository/user.repository";
import { CheckinService } from "../services/checkin.service";
import { idInParamsValidator, validatePagination } from "../validators/comon-validator";
import { validathor } from "../middlewares/validathor.middleware";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { Roles } from "../utils/roles.constant";

const userRepository = new UserRepository
const checkinRepository = new CheckinRepository
const checkinService = new CheckinService(
  checkinRepository,
  userRepository
)

const checkinController = new CheckinController(checkinService)
const authMiddleware = new AuthMiddleware()

export const checkinRouter = Router()

checkinRouter.post(
  '/:identifier',
  authMiddleware.authentication,
  authMiddleware.authorization(Roles.RECEPTION),
  checkinController.save
)

checkinRouter.get(
  '/',
  authMiddleware.authentication,
  authMiddleware.authorization(Roles.RECEPTION),
  validatePagination,
  validathor,
  checkinController.find
)