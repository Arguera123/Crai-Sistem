export interface IUser {
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  gender: string,
  roles: string[],
  type: string,
  token: string,
  state: string,
  faculty: string,
  photo: string,
  expirationDate: Date,
}

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

export type TLoginForm = Pick<
  IUser,
  'email' 
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

export type TUserResponse = Pick<
  IUser,
  'id' |
  'firstName' |
  'lastName' |
  'email' |
  'type' |
  'faculty' |
  'photo' |
  'roles' |
  'state' |
  'gender' |
  'expirationDate'
>

export interface MicrosoftAuthResult {
  token?: string;
  error?: string;
}
