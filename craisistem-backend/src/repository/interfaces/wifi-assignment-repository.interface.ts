import { WifiAssignment } from "../../models/wifi-assignment.entity";
import { UserData } from "../../models/user.entity";
import { WifiUser } from "../../models/wifi-user.entity";

export interface IWifiAssignmentRepository {
  save(wifiAssignment: WifiAssignment): Promise<void>;
  findByWifiUserId(wifiUser: WifiUser): Promise<WifiAssignment[]>;
  findByUserId(user: UserData): Promise<WifiAssignment[]>;
  findByUserAndWifiUser(user: UserData, wifiUser: WifiUser): Promise<WifiAssignment | null>;
  delete(user: UserData, wifiUser: WifiUser): Promise<void>;
  findAll(page?: number, limit?: number): Promise<{ data: WifiAssignment[]; total: number }>;
}