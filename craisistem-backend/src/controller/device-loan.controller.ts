import { Request, Response, NextFunction } from "express";
import { mapLoanFilters } from "../helper/toEntityFilters";
import { ILoanDeviceService } from "../service/interfaces/loan-device-service.interface";


export class DeviceLoanController {
  constructor(
    private deviceLoanService: ILoanDeviceService
  ) {}
  public chargeLoan = async (
    req : Request,
    res : Response,
    next : NextFunction
  ) => {
    try {
      const librarian = req.user_data
      const { userId, resourceId } = req.body

      await this.deviceLoanService.chargeLoan(librarian, userId, resourceId)

      res.status(200).json({ message: "Loan registered correctly" })
    } catch (err) {
      next(err)
    }
  }

  public releaseLoan = async (
    req : Request,
    res : Response,
    next : NextFunction
  ) => {
    try {
      const user = req.user_data
      const { identifier } = req.params

      await this.deviceLoanService.releaseLoan(user, identifier as string)

      res.status(200).json({ message: "Loan completed correctly" })
    } catch (err) {
      next(err)
    }
  }

  public find = async (
    req : Request,
    res : Response,
    next : NextFunction
  ) => {
    try {
      const filters = mapLoanFilters(req.query)
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || 10
      const result = await this.deviceLoanService.find(filters, page, limit)

      res.status(200).json(result)
    } catch (err) {
      next(err)
    }
  }
}