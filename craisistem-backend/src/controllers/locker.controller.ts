import { NextFunction, Request, Response } from "express";
import { LockerService } from "../services/locker.service";

export class LockerController {
  constructor(
    private lockerService: LockerService
  ) {}

  public save = async (
    req: Request, 
    res: Response, 
    next: NextFunction
  ) => {
    try {
      const { num } = req.body;

      await this.lockerService.save(num);
      res.status(201).json({ message: "Casillero creado correctamente" });
    } catch (err) {
      next(err);
    }
  };

  public find = async (
    req: Request, 
    res: Response, 
    next: NextFunction
  ) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.lockerService.find(page, limit)

      res.status(200).json(result)
    } catch (err) {
      next(err)
    }
  }
}
