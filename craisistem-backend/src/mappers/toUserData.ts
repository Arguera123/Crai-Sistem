import { TRegisterForm } from "../models/types/IUser";
import { UserData } from "../models/user.entity";
import { saveBase64Image } from "../utils/saveBase64Image";

export const toUserData = (registerForm: TRegisterForm): UserData => {
  const user: UserData = new UserData;
  user.id = registerForm.id
  user.email = registerForm.email
  user.expirationDate = registerForm.expirationDate
  user.firstName = registerForm.firstName
  user.lastName = registerForm.lastName
  user.gender = registerForm.gender
  user.type = registerForm.type

  return user
}