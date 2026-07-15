import createHttpError from "http-errors";
import PostgresDataSource from "../configs/db.config"
import { Device } from "../models/device.entity"
import { TCreateDevice, TDeviceFilters, TUpdateDevice } from "../models/types/IDevice";
import { DeviceRepository } from "../repository/device.repository";
import { ResourceStates } from "../utils/states.constant";

export class DeviceService {
  constructor(
    private deviceRepository: DeviceRepository
  ) {}

  public save = async (createDevice: TCreateDevice) => {
    const device: Device = Object.assign(new Device(), createDevice);
    device.state = ResourceStates.FREE
    
    await this.deviceRepository.save(device)
  }

public update = async (deviceId: number, updateData: TUpdateDevice): Promise<void> => {

  const device = await this.deviceRepository.findById(deviceId);
  if (!device) throw createHttpError(404, 'Equipo no encontrado');
  const cleanData = Object.fromEntries(
    Object.entries(updateData).filter(([_, v]) => v !== undefined)
  );

  if (cleanData.state) {
    device.state = cleanData.state as ResourceStates;
  }

  Object.assign(device, cleanData);

  await this.deviceRepository.save(device);
}

  public find = async (
    filters: TDeviceFilters,
    page: number = 1,
    limit: number = 10
  ) => {
    const { data, total } = await this.deviceRepository.find(page, limit, filters)

    return {
      data,
      pagination: {
        total,
        limit,
        page,
        totalPages: Math.ceil(total/limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1
      }
    }
  }
}

