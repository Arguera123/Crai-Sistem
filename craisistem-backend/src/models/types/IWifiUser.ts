import { IUser } from "./IUser";
export interface IWifiUser {
  id: string;
  password: string;
  creationDate: Date;
  expirationDate: Date;
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
