import { Router } from "express";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { validathor } from "../middleware/validathor.middleware";
import { UserRepository } from "../repository/user.repository";
import { LoanLockerService } from "../service/loan-locker.service";
import { LockerRepository } from "../repository/locker.repository";
import { LockerLoanController } from "../controller/locker-loan.controller";
import { idInParamsValidator, validatePagination } from "../validator/comon-validator";
import { Roles } from "../utils/roles.constant";
import { createLoanValidator, lockerLoanFiltersValidator } from "../validator/loan.validator";
import { LoanRepository } from "../repository/loan.repository";
import { LoanLockerRepository } from "../repository/loan-locker.repository";
import { LoanChargeRepository } from "../repository/loan-charge.repository";
import { LoanReleaseRepository } from "../repository/loan-release.repository";
import { CheckinRepository } from "../repository/checkin.repository";

const loanRepository = new LoanRepository
const chargeRepository = new LoanChargeRepository
const releaseRepository = new LoanReleaseRepository
const userRepository = new UserRepository
const lockerRepository = new LockerRepository
const loanLockerRepository = new LoanLockerRepository
const lockerLoanService = new LoanLockerService(
  chargeRepository,
  releaseRepository,
  lockerRepository,
  userRepository,
  loanRepository,
  loanLockerRepository

)
const lockerLoanController = new LockerLoanController(lockerLoanService)

export const lockerLoanRouter = Router()

const authMiddleware = new AuthMiddleware()

lockerLoanRouter.post(
  '/charge',
  authMiddleware.authentication,
  authMiddleware.authorization(Roles.RECEPTION),
  createLoanValidator,
  validathor,
  lockerLoanController.chargeLoan 
)

lockerLoanRouter.post(
  '/release/:identifier',
  authMiddleware.authentication,
  authMiddleware.authorization(Roles.RECEPTION),
  idInParamsValidator,
  validathor,
  lockerLoanController.releaseLoan
)

lockerLoanRouter.get(
  '/',
  authMiddleware.authentication,
  authMiddleware.authorization(Roles.RECEPTION),
  validatePagination,
  lockerLoanFiltersValidator,
  validathor,
  lockerLoanController.find
)

