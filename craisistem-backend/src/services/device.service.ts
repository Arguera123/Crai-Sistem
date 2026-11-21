import createHttpError from "http-errors";
import { Device } from "../models/device.entity"
import { TCreateDevice, TDeviceFilters, TUpdateDevice } from "../models/types/IDevice";
import { DeviceRepository } from "../repository/device.repository";
import { ResourceStates } from "../utils/states.constant";

export class DeviceService {
  constructor(
    private deviceRepository: DeviceRepository
  ) {}

  public save = async (createDevice: TCreateDevice) => {
    const device = new Device();
    device.brand = createDevice.brand
    device.section = createDevice.section
    device.model = createDevice.model
    device.inventory = createDevice.inventory
    device.operatingSystem = createDevice.operatingSystem
    device.state = ResourceStates.FREE
    
    await this.deviceRepository.save(device)
  }

public update = async (deviceId: number, updateData: TUpdateDevice): Promise<void> => {

  const device = await this.deviceRepository.findById(deviceId);
  if (!device) throw createHttpError(404, 'Equipo no encontrado');
  // Solo se permiten estos campos: evita que el cliente sobrescriba el id u otras columnas
  const allowed: (keyof TUpdateDevice)[] = ['brand', 'state', 'section', 'model', 'inventory', 'operatingSystem'];
  const cleanData = Object.fromEntries(
    Object.entries(updateData ?? {}).filter(([k, v]) => allowed.includes(k as keyof TUpdateDevice) && v !== undefined)
  );

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

