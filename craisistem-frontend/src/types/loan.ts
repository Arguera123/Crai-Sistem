import type { IDevice } from "./device";
import type { ILocker } from "./loker";
import type { IUser } from "./user";


interface ILoanCharge {
  loanId: string;
  librarianId: string;
  startTime: string;
}

interface ILoanRelease {
  loanId: string;
  librarianId: string;
  endTime: string;
}

export interface IChargeLoanPayload {
  userId: string;
  resourceId: number;
}

export interface ILoan {
  id: string;
  date: Date;
}

export type TLoanResponse = Pick<ILoan, "id" | "date"> & {
  user: Pick<IUser, "id" | "firstName" | "lastName" | "photo">;
  charge?:
    | (Pick<ILoanCharge, "startTime"> & {
        librarian: Pick<IUser, "firstName" | "lastName">;
      })
    | null;
  release?:
    | (Pick<ILoanRelease, "endTime"> & {
        librarian: Pick<IUser, "firstName" | "lastName">;
    })
    | null;
}

export type TDeviceLoanResponse = TLoanResponse & {
  device: Pick<IDevice, "id" | "operatingSystem">
}

export type TLockerLoanResponse = TLoanResponse & {
  locker: Pick<ILocker, "id">
}

export type TLoanTable = {
  id: string;
  name: string;
  resource: string;
  date: string;
  charge: string;
  chargeTime: string;
  release: string;
  releaseTime: string;
}
