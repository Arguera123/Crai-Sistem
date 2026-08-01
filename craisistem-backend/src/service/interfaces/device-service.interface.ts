import {
  TCreateDevice,
  TDeviceFilters,
  TUpdateDevice,
} from "../../models/types/IDevice";
import { Device } from "../../models/device.entity";
import { PaginatedResponse } from "../../models/types/IPaginatedResponse";

export interface IDeviceService {
  save(createDevice: TCreateDevice): Promise<void>;
  update(deviceId: number, updateData: TUpdateDevice): Promise<void>;
  find(
    filters: TDeviceFilters,
    page?: number,
    limit?: number,
  ): Promise<PaginatedResponse<Device>>;
}
