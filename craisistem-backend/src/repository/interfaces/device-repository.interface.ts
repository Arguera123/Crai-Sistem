import { Device } from "../../models/device.entity";
import { TDeviceFilters } from "../../models/types/IDevice";

export interface IDeviceRepository {
  save(device: Device): Promise<void>;
  findById(id: number): Promise<Device>;
  find(
    page?: number,
    limit?: number,
    filters?: TDeviceFilters
  ): Promise<{ data: Device[]; total: number }>;
}
