import { SelectQueryBuilder } from "typeorm";
import { WifiAssignment } from "../../models/wifi-assignment.entity";

export const WifiAssignmentSpecs = {
  byWifiUserId: (userId?: string) => (query: SelectQueryBuilder<WifiAssignment>) => {
    if (!userId) return;
    query.andWhere("user.id = :userId", { userId: userId })
  },

  byUserWifiId: (userWifiId?: string) => (query: SelectQueryBuilder<WifiAssignment>) => {
    if (!userWifiId) return;
    query.andWhere("wifiUser.id = :userWifiId", { userWifiId: userWifiId })
  },

  byLibrarinaId: (librarianId?: string) => (query: SelectQueryBuilder<WifiAssignment>) => {
    if (!librarianId) return;
    query.andWhere("user.id = :librarianId", { librarianId: librarianId })
  }
}
