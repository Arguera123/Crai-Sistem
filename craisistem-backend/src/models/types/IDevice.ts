import { OSEnum } from "../device.entity";

export interface IDevice {
  id: number,
  brand: string,
  state: string,
  section: string,
  model: string,
  inventory: string,
  operatingSystem: OSEnum
}

export type TCreateDevice = Pick<IDevice, 
  'brand' |
  'state' |
  'section' |
  'model' |
  'inventory' |
  'operatingSystem'
>

export type TUpdateDevice = Partial<Pick<IDevice,
  'brand' |
  'state' |
  'section' |
  'model' |
  'inventory' |
  'operatingSystem'
>>;

export type TDeviceFilters = Partial<Pick<IDevice,
  'id' |
  'brand' |
  'state' |
  'inventory' |
  'model' |
  'operatingSystem' |
  'section'
> & { order: string }>;