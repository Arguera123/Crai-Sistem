import type { IUser } from "./user";

export interface IWifiUser {
  id: string;
  password: string;
  creationDate: Date;
  expirationDate: Date;
}

export interface IWifiAssignment {
  id: string
  librarian: IUser[]
  wifiUser: IWifiUser[]
  timestamp: Date
}

export type TWifiUserResponse = Pick<
  IWifiUser,
  "id" | "password" | "creationDate" | "expirationDate"
> & {
  assignments: {
    user: Pick<IUser, "id" | "firstName" | "lastName">
    librarian: Pick<IUser, "firstName" | "lastName">
    timestamp: Date
  }[]
};

export type TWifiUserPayload = {
  userId: string,
  wifiUserId: string
}