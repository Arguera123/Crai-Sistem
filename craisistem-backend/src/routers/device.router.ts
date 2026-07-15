import { Router } from "express";
import { DeviceController } from "../controllers/device.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { DeviceRepository } from "../repository/device.repository";
import { DeviceService } from "../services/device.service";
import { validathor } from "../middlewares/validathor.middleware";
import { createDeviceValidator, updateDeviceValidator } from "../validators/device.validator";
import { Roles } from "../utils/roles.constant";
import { idInParamsValidator, validatePagination } from "../validators/comon-validator";

const deviceRepository = new DeviceRepository
const deviceService = new DeviceService(deviceRepository)

const deviceController = new DeviceController(deviceService)
const authMiddleware = new AuthMiddleware()

export const deviceRouter = Router()

deviceRouter.post(
  "/",
  authMiddleware.authentication,
  authMiddleware.authorization(Roles.ADMIN),
  createDeviceValidator,
  validathor,
  deviceController.save
)

deviceRouter.get(
  "/",
  authMiddleware.authentication,
  authMiddleware.authorization(Roles.LEARNING_CENTER),
  validatePagination,
  validathor,
  deviceController.find
)

deviceRouter.put(
  "/:identifier",
  authMiddleware.authentication,
  authMiddleware.authorization(Roles.ADMIN),
  updateDeviceValidator,
  validathor,
  deviceController.update
)