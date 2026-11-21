import { Request, Response, NextFunction } from "express";
import { CheckinService } from "../services/checkin.service";
import { mapCheckinFilters } from "../mappers/toEntityFilters";

export class CheckinController {
  constructor(
    private checkinService: CheckinService
  ) {}

  public save = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { identifier: userId } = req.params
      const checkin = await this.checkinService.save(userId as string)
      res.status(201).json({ message: "Ingresado correctamente", checkin })
    } catch (err) {
      next(err);
    }
  }

  public find = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const filters = mapCheckinFilters(req.query)
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || 10

      const result = await this.checkinService.find(filters, page, limit)
      
      res.status(200).json(result)
    } catch (err) {
      next(err)
    }
  }
}