import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { TCreateDevice, TUpdateDevice } from "../models/types/IDevice";
import { DeviceService } from "../services/device.service";
import { mapDeviceFilters } from "../mappers/toEntityFilters";

export class DeviceController {
  constructor(
    private deviceService: DeviceService
  ) {}

  public save = async (
    req: Request,
    res: Response,
    next: NextFunction 
  ) => {
    try {
      const deviceDTO: TCreateDevice = req.body;
      
      await this.deviceService.save(deviceDTO)

      res.status(201).json({ message: "Computadora registrada correctamente" })
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
      const filters = mapDeviceFilters(req.query)
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || 10
      const result = await this.deviceService.find(filters, page, limit)

      res.status(200).json(result)
    } catch (err) {
      next(err)
    }
  }

  public update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { identifier: deviceId } = req.params
      const deviceUpdate: TUpdateDevice = req.body

      const id = Number(deviceId)
      if (!Number.isInteger(id) || id < 1) throw createHttpError(400, "El id del equipo debe ser un numero entero")

      await this.deviceService.update(id, deviceUpdate)
      res.status(200).json({ message: "Computadora actualizada correctamente" })
    } catch (err) {
      next(err)
    }
  }
}