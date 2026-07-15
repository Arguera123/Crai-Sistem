import type { IUser } from "./user"

export interface ICheckin {
  id: string,
  date: Date,
  time: string,
  user: IUser
}

export type TPostCheckinResponse = {
  message: string,
  checkin: TCheckinResponse
}

export type TCheckinResponse = Pick<ICheckin, 'date' | 'time'> & {
  id: string,
  firstName: string,
  lastName: string,
  photo: string
}