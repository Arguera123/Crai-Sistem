import { UUID } from "typeorm/driver/mongodb/bson.typings.js";
import { IDevice } from "./IDevice";

export interface IComplement {
  id: UUID,
  name: string,
  brand: string,
  state: string,
  model: string,
  inventary: string,
  device: IDevice
}