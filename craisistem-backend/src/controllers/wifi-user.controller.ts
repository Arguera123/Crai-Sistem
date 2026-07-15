import { Request, Response, NextFunction } from "express";
import { WifiUserService } from "../services/wifi-user.service";
import { mapWifiUserFilters } from "../mappers/toEntityFilters";
export class WifiUserController {
  constructor(
    private wifiUserService: WifiUserService
  ) {}

  public importFromCsv = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.wifiUserService.import(req.file);

      res.status(200).json({
        message: `${result.inserted} users inserted, ${result.skipped} skipped`,
        ...result
      });
    } catch (error) {
      next(error);
    }
  }

  public find = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filters = mapWifiUserFilters(req.query)
      const result = await this.wifiUserService.find(filters, page, limit)
      res.status(200).json(result)
    } catch (err) {
      next(err)
    }
  }

  public assingToUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const librarian = req.user_data
      const { userId, wifiUserId } = req.body

      await this.wifiUserService.assignToUser(librarian, userId, wifiUserId) 
      res.status(200).json({ message: "Usuario asignado correctamente" })
    } catch (err) {
      next(err)
    }
  }

  public deleteAssign = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
    } catch (err) {
      next(err)
    }
  }
}