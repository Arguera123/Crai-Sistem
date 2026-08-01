import { Router } from "express";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { DeviceLoanController } from "../controller/device-loan.controller";
import { LoanDeviceService } from "../service/loan-device.service";
import { UserRepository } from "../repository/user.repository";
import { DeviceRepository } from "../repository/device.repository";
import { validathor } from "../middleware/validathor.middleware";
import { idInParamsValidator, validatePagination } from "../validator/comon-validator";
import { Roles } from "../utils/roles.constant";
import { deviceLoanFiltersValidator, createLoanValidator } from "../validator/loan.validator";
import { Routes } from "../utils/routes.constant";
import { LoanDeviceRepository } from "../repository/loan-device.repository";
import { LoanRepository } from "../repository/loan.repository";
import { LoanChargeRepository } from "../repository/loan-charge.repository";
import { LoanReleaseRepository } from "../repository/loan-release.repository";

const loanRepository = new LoanRepository
const loanDeviceRepository = new LoanDeviceRepository
const chargeRepository = new LoanChargeRepository
const releaseRepository = new LoanReleaseRepository
const userRepository = new UserRepository
const deviceRepository = new DeviceRepository
const deviceLoanService = new LoanDeviceService(
  chargeRepository,
  releaseRepository,
  deviceRepository,
  userRepository,
  loanRepository,
  loanDeviceRepository
)

const deviceLoanController = new DeviceLoanController(deviceLoanService)
const authMiddleware = new AuthMiddleware()

export const deviceLoanRouter = Router()

deviceLoanRouter.post(
  Routes.CHARGE,
  authMiddleware.authentication,
  authMiddleware.authorization(Roles.LEARNING_CENTER),
  createLoanValidator,
  validathor,
  deviceLoanController.chargeLoan
)

deviceLoanRouter.post(
  `${Routes.RELEASE}/:identifier`,
  authMiddleware.authentication,
  authMiddleware.authorization(Roles.LEARNING_CENTER),
  idInParamsValidator,
  validathor,
  deviceLoanController.releaseLoan
)

deviceLoanRouter.get(
  '/',
  authMiddleware.authentication,
  authMiddleware.authorization(Roles.LEARNING_CENTER),
  validatePagination,
  deviceLoanFiltersValidator,
  validathor,
  deviceLoanController.find
)