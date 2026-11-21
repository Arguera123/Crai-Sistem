import { TUserResponse } from "../models/types/IUser";
import { UserData } from "../models/user.entity";
import { getPhotoUrl } from "../utils/photo-url";

export const toUserResponse = (
  user: UserData
): TUserResponse => {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    type: user.type,
    photo: getPhotoUrl(user.photo),
    state: user.state,
    roles: (user.roles ?? []).map(_r => _r.name),
    gender: user.gender,
    faculty: user.faculty,
    expirationDate: user.expirationDate
  }
}