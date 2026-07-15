import type { UserType } from "../utils/user-type.constants"

export interface IUser {
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  gender: string,
  roles: string[],
  type: UserType,
  token: string,
  state: string,
  faculty: string,
  photo: string,
  expirationDate: Date,
}

export type TUserResponse = Pick<
  IUser,
  'id' |
  'firstName' |
  'lastName' |
  'email' |
  'type' |
  'photo' |
  'roles' |
  'state' |
  'gender' |
  'faculty' |
  'expirationDate'
>

export type TRegisterForm = Pick<
  IUser, 
  'id' | 
  'firstName' | 
  'lastName' | 
  'email' | 
  'gender' | 
  'type' | 
  'expirationDate' 
>

export type TWhoamiResponse = Pick<
  IUser,
  'id' |
  'firstName' |
  'lastName' |
  'email' |
  'type' |
  'faculty' |
  'roles'
>

export type LoginResponse = {
  token: string
}

export interface TManualFetchResponse {
  message?: string;
}
