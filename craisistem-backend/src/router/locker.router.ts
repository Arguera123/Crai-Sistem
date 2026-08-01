import { Router } from "express";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { LockerController } from "../controller/locker.controller";
import { LockerRepository } from "../repository/locker.repository";
import { LockerService } from "../service/locker.service";
import { Roles } from "../utils/roles.constant";

const lockerRepository = new LockerRepository
const lockerService = new LockerService(lockerRepository)

const lockerController = new LockerController(lockerService)
const authMiddleware = new AuthMiddleware()

export const lockerRouter = Router()

lockerRouter.get(
  '/',
  authMiddleware.authentication,
  authMiddleware.authorization(Roles.RECEPTION),
  lockerController.find
)