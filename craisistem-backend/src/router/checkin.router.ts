import { Router } from "express";
import { CheckinController } from "../controller/checkin.controller";
import { CheckinRepository } from "../repository/checkin.repository";
import { UserRepository } from "../repository/user.repository";
import { CheckinService } from "../service/checkin.service";
import { idInParamsValidator, validatePagination } from "../validator/comon-validator";
import { validathor } from "../middleware/validathor.middleware";
import { AuthMiddleware } from "../middleware/auth.middleware";
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