import { Router } from "express";
import { userRouter } from './user.router'
import { deviceRouter } from "./device.router";
import { authRouter } from "./auth.router";
import { deviceLoanRouter } from "./device-loan.router";
import { lockerRouter } from "./locker.router";
import { lockerLoanRouter } from "./locker-loan-router";
import { wifiUserRouter } from "./wifi-user.router";
import { checkinRouter } from "./checkin.router";
import { Routes } from "../utils/routes.constant";

const router = Router()

router.use(Routes.AUTH, authRouter)
router.use(Routes.USER, userRouter)
router.use(Routes.DEVICE, deviceRouter)
router.use(Routes.DEVICE_LOAN, deviceLoanRouter)
router.use(Routes.LOCKER, lockerRouter)
router.use(Routes.LOCKER_LOAN, lockerLoanRouter)
router.use(Routes.WIFI_USER, wifiUserRouter)
router.use(Routes.CHECKIN, checkinRouter)

export default router