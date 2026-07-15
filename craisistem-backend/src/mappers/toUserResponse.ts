import { TUserResponse } from "../models/types/IUser";
import { UserData } from "../models/user.entity";

export const toUserResponse = (
  user: UserData
): TUserResponse => {
  const apiUrl = user.photo 
    ? `${process.env.API_URL}${user.photo}`
    : `http://localhost:8080${user.photo}`
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    type: user.type,
    photo: apiUrl,
    state: user.state,
    roles: user.roles.map(_r => _r.name),
    gender: user.gender,
    faculty: user.faculty,
    expirationDate: user.expirationDate
  }
}