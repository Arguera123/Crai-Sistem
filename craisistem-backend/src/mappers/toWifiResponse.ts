import { TWifiUserResponse } from "../models/types/IWifiUser";
import { WifiUser } from "../models/wifi-user.entity";

export const toWifiResponse = (wifiUser: WifiUser): TWifiUserResponse => {
  return {
    id: wifiUser.id,
    password: wifiUser.password,
    creationDate: wifiUser.creationDate,
    expirationDate: wifiUser.expirationDate,
    assignments: (wifiUser.assignments ?? []).map((assignment) => ({
      user: {
        id: assignment.user?.id || "",
        firstName: assignment.user?.firstName || "N/A",
        lastName: assignment.user?.lastName || "",
      },
      librarian: {
        firstName: assignment.librarian?.firstName || "N/A",
        lastName: assignment.librarian?.lastName || "",
      },
      timestamp: assignment.timestamp,
    })),
  };
};
