export interface IDevice {
  id: number,
  brand: string,
  state: string,
  section: string,
  model: string,
  inventory: string,
  operatingSystem: "windows" | "linux" | "mac" | "";
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