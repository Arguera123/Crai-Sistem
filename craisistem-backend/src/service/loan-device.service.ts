import { UserData } from "../models/user.entity";
import { ResourceStates, UserStates } from "../utils/states.constant";
import { IDeviceRepository } from "../repository/interfaces/device-repository.interface";
import { IUserRepository } from "../repository/interfaces/user-repository.interface";
import { PaginatedResponse } from "../models/types/IPaginatedResponse";
import { LoanDevice } from "../models/loan-device";
import { Loan } from "../models/loan.entity";
import { LoanRelease } from "../models/loan-release.entity";
import { LoanCharge } from "../models/loan-charge.entity";
import { TLoanFilters } from "../models/types/ISearchFilters";
import { toDeviceLoanResponse } from "../helper/toLoanResponse";
import { TDeviceLoanResponse } from "../models/types/ILoans";
import { getElSalvadorDateObject, getElSalvadorTime } from "../utils/dataTime";
import { ErrorCodes } from "../error/errorCodes";
import { NotFoundError } from "../error/not-found.error";
import { ConflictError } from "../error/conflict.error";
import { ILoanDeviceRepository } from "../repository/interfaces/loan-device-repository.interface";
import { ILoanRepository } from "../repository/interfaces/loan-repository.interface";
import { ILoanReleaseRepository } from "../repository/interfaces/loan-release-repository";
import { ILoanChargeRepository } from "../repository/interfaces/loan-charge-repository.interface";
import { ILoanDeviceService } from "./interfaces/loan-device-service.interface";
import { toPagination } from "../helper/toPagination";

export class LoanDeviceService implements ILoanDeviceService {
  constructor(
    private chargeRepository: ILoanChargeRepository,
    private releaseRepository: ILoanReleaseRepository,
    private deviceRepository: IDeviceRepository,
    private userRepository: IUserRepository,
    private loanRepository: ILoanRepository,
    private loanDeviceRepository: ILoanDeviceRepository,
  ) {}

  public chargeLoan = async (
    librarin: UserData,
    userId: string,
    deviceId: number,
  ) => {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundError(ErrorCodes.USER.NOT_FOUND);
    if (user.state === UserStates.INACTIVE)
      throw new ConflictError(ErrorCodes.USER.INACTIVE);

    const device = await this.deviceRepository.findById(deviceId);
    if (!device) throw new NotFoundError(ErrorCodes.DEVICE.NOT_FOUND);
    if (device.state !== ResourceStates.FREE)
      throw new ConflictError(ErrorCodes.DEVICE.IN_USE);

    const activeLoan = await this.loanRepository.findActiveDeviceLoansByUser(
      user.id,
    );
    if (activeLoan.length > 0)
      throw new ConflictError(ErrorCodes.LOAN.ACTIVE_EXISTS);

    const loan = new Loan();
    loan.user = user;
    loan.date = getElSalvadorDateObject();
    const savedLoan = await this.loanRepository.save(loan);

    const loanDevice = new LoanDevice();
    loanDevice.loan = savedLoan;
    loanDevice.device = device;
    await this.loanDeviceRepository.save(loanDevice);

    const charge = new LoanCharge();
    charge.librarian = librarin;
    charge.loan = savedLoan;
    charge.startTime = getElSalvadorTime();

    device.state = ResourceStates.OCCUPIED;
    await this.deviceRepository.save(device);
    await this.chargeRepository.save(charge);
  };

  public releaseLoan = async (librarian: UserData, loanId: string) => {
    const loan = await this.loanRepository.findById(loanId);
    if (!loan) throw new NotFoundError(ErrorCodes.LOAN.NOT_FOUND);
    if (loan.release) throw new ConflictError(ErrorCodes.LOAN.ALREADY_RELEASED);

    const release = new LoanRelease();
    release.loan = loan;
    release.librarian = librarian;
    release.endTime = getElSalvadorTime();

    const device = loan.loanDevice.device;
    device.state = ResourceStates.FREE;
    await this.deviceRepository.save(device);
    await this.releaseRepository.save(release);
  };

  public find = async (
    filters: TLoanFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<TDeviceLoanResponse>> => {
    const { data: loans, total } = await this.loanRepository.findDeviceLoans(
      filters,
      page,
      limit,
    );
    const data: TDeviceLoanResponse[] = loans.map(toDeviceLoanResponse);
    return {
      data,
      pagination: toPagination(total, page, limit)
    };
  };
}
