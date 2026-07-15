import { SelectQueryBuilder } from "typeorm";
import { WifiUser } from "../../models/wifi-user.entity";

export const WifiUserSpecs = {
  byWifiUserId: (wifiUserId?: string) => (query: SelectQueryBuilder<WifiUser>) => {
    if (!wifiUserId) return;
    query.andWhere("wifiUser.id = :wifiUserId", { wifiUserId })
  },

  byUserId: (userId?: string) => (query: SelectQueryBuilder<WifiUser>) => {
    if (!userId) return;
    query.andWhere("user.id = :userId", { userId }) 
  },

  byLibrarianId: (librarianId?: string) => (query: SelectQueryBuilder<WifiUser>) => {
    if (!librarianId) return;
    query.andWhere("librarian.id = :librarianId", { librarianId })
  },

  byCreationDate: (creationDate?: string | Date) => (query: SelectQueryBuilder<WifiUser>) => {
    if (!creationDate) return;
    query.andWhere("wifiUser.creationDate = :creationDate", { creationDate })
  },

  byExpirationDate: (expirationDate?: string | Date) => (query: SelectQueryBuilder<WifiUser>) => {
    if (!expirationDate) return;
    query.andWhere("wifiUser.expirationDate = :expirationDate", { expirationDate })
  }
}