import { Repository } from "typeorm";
import PostgresDataSource from "../configs/db.config";
import { Device } from "../models/device.entity";
import { IDeviceRepository } from "./interfaces/device-repository.interface";
import { TDeviceFilters } from "../models/types/IDevice";
import { SpecificationBuilder } from "./specifications/SpecificationBuilder";
import { DeviceSpecs } from "./specifications/DeviceSpecs";

export class DeviceRepository implements IDeviceRepository {
  private repo: Repository<Device>

  constructor() {
    this.repo = PostgresDataSource.getRepository(Device)
  }

  public save = async (device: Device) => {
    await this.repo.save(device)
  }

  public findById = async (id: number): Promise<Device> => {
    return await this.repo.findOne({
      where: { id }
    })
  }

  public find = async (
    page: number = 1,
    limit: number = 10,
    filters: TDeviceFilters
  ): Promise<{ data: Device[]; total: number }> => {

    const { query, builder } = this.buildBaseDeviceQuery(filters)

    builder.build(query)

    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();

    return { data, total }
  }

  private buildBaseDeviceQuery(filters: TDeviceFilters) {
    const query = this.repo
      .createQueryBuilder("device")

    const builder = new SpecificationBuilder<Device>();

    builder
      .add(DeviceSpecs.byId(filters.id))
      .add(DeviceSpecs.byBrand(filters.brand))
      .add(DeviceSpecs.byInventory(filters.inventory))
      .add(DeviceSpecs.byModel(filters.model))
      .add(DeviceSpecs.byState(filters.state))
      .add(DeviceSpecs.byOperatingSystem(filters.operatingSystem))
      .add(DeviceSpecs.byOrder(filters.order))

    return { query, builder };
  }
}