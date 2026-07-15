import { IUser } from "./IUser";

export interface ICheckin {
  id: string,
  date: Date,
  time: string,
  user: IUser
}

export type TCheckinResponse = Pick<ICheckin, 'date' | 'time'> & {
  id: string,
  firstName: string,
  lastName: string,
  photo: string,
}