import { Request, Response, NextFunction } from "express"
import { UserService } from "../services/user.service"
import { TRegisterForm, TUserResponse } from "../models/types/IUser";
import { mapUserFilters } from "../mappers/toEntityFilters";
import { SyncManager } from "../job/sync-manager";

export class UserDataController {
  constructor(
    private userService: UserService
  ) {}

  public register = async (req : Request, res : Response, next : NextFunction) => {
      try {
        const user: TRegisterForm = req.body;
        await this.userService.register(user);
        res.status(201).json({ message: "User registered" });
      } catch (err) {
        next(err);
      }
    };

  public assignRoles = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { role } = req.body
      const { identifier: userId } = req.params
      await this.userService.assignRole(userId as string, role)
      res.status(200).json({ message: "Roles added successfully" })
    } catch (err) {
      next(err)
    }
  }

  public removeRoles = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { role } = req.body
      const { identifier: userId } = req.params
      await this.userService.removeRole(userId as string, role)
      res.status(200).json({ message: "Roles romoved successfully" })
    } catch (err) {
      next(err)
    }
  }

  public find = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const filters = mapUserFilters(req.query)
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || 10

      const result = await this.userService.find(filters, page, limit)

      res.status(200).json(result)
    } catch (err) {
      next(err)
    }
  }

  public findById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { identifier: userId } = req.params
      const result = await this.userService.findById(userId as string)

      res.status(200).json(result)
    } catch (err) {
      next(err)
    }
  }

  public manualFetch = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const manager = new SyncManager();

    await manager.startSync();
    res.json({ message: "Sinconización manual completada" })
  }
}