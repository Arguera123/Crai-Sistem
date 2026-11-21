import { getPhotoUrl } from "../utils/photo-url";
import { OSEnum } from "../models/device.entity";
import { Loan } from "../models/loan.entity";
import { TDeviceLoanResponse, TLoanResponse, TLockerLoanResponse } from "../models/types/ILoans";


const toLoanResponse = (
  loan: Loan
): TLoanResponse => {
  return {
    id: loan.id,
    date: loan.date,
    user: {
      id: loan.user.id,
      firstName: loan.user.firstName,
      lastName: loan.user.lastName,
      photo: getPhotoUrl(loan.user.photo),
    },
    charge: loan.charge?.librarian
      ? {
          startTime: loan.charge.startTime,
          librarian: {
            firstName: loan.charge.librarian.firstName,
            lastName: loan.charge.librarian.lastName,
          },
        }
      : null,
    release: loan.release?.librarian
      ? {
          endTime: loan.release.endTime,
          librarian: {
            firstName: loan.release.librarian.firstName,
            lastName: loan.release.librarian.lastName,
          },
        }
      : null,
  };
}

export const toLockerLoanResponse = (
  loan: Loan
): TLockerLoanResponse => {
  return {
    ...toLoanResponse(loan),
    locker: {
      id: loan.loanLocker.lockerId
    }
  }
}

export const toDeviceLoanResponse = (
  loan: Loan
): TDeviceLoanResponse => {
  return {
    ...toLoanResponse(loan),
    device: {
      id: loan.loanDevice.deviceId,
      operatingSystem: loan.loanDevice.device.operatingSystem as OSEnum
    }
  }
}