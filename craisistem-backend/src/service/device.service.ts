import { ErrorCodes } from "../error/errorCodes";
import { NotFoundError } from "../error/not-found.error";
import { toPagination } from "../helper/toPagination";
import { Device } from "../models/device.entity";
import {
  TCreateDevice,
  TDeviceFilters,
  TUpdateDevice,
} from "../models/types/IDevice";
import { IDeviceRepository } from "../repository/interfaces/device-repository.interface";
import { ResourceStates } from "../utils/states.constant";
import { IDeviceService } from "./interfaces/device-service.interface";

export class DeviceService implements IDeviceService {
  constructor(private deviceRepository: IDeviceRepository) {}

  public save = async (createDevice: TCreateDevice) => {
    const device: Device = Object.assign(new Device(), createDevice);
    device.state = ResourceStates.FREE;

    await this.deviceRepository.save(device);
  };

  public update = async (
    deviceId: number,
    updateData: TUpdateDevice,
  ): Promise<void> => {
    const device = await this.deviceRepository.findById(deviceId);
    if (!device) throw new NotFoundError(ErrorCodes.DEVICE.NOT_FOUND);
    const cleanData = Object.fromEntries(
      Object.entries(updateData).filter(([_, v]) => v !== undefined),
    );

    if (cleanData.state) {
      device.state = cleanData.state as ResourceStates;
    }

    Object.assign(device, cleanData);

    await this.deviceRepository.save(device);
  };

  public find = async (
    filters: TDeviceFilters,
    page: number = 1,
    limit: number = 10,
  ) => {
    const { data, total } = await this.deviceRepository.find(
      page,
      limit,
      filters,
    );

    return {
      data,
      pagination: toPagination(total, page, limit)
    };
  };
}
