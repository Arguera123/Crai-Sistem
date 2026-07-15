import { IUser } from "./IUser"
import { IWifiUser } from "./IWifiUser"

export interface IWifiAssignment {
  id: string
  librarian: IUser[]
  wifiUser: IWifiUser[]
  timestamp: Date
}