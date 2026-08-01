import { UserData } from "../models/user.entity";
import { ResourceStates, UserStates } from "../utils/states.constant";
import { IUserRepository } from "../repository/interfaces/user-repository.interface";
import { PaginatedResponse } from "../models/types/IPaginatedResponse";
import { LoanRepository } from "../repository/loan.repository";
import { Loan } from "../models/loan.entity";
import { LoanChargeRepository } from "../repository/loan-charge.repository";
import { LoanRelease } from "../models/loan-release.entity";
import { LoanReleaseRepository } from "../repository/loan-release.repository";
import { LoanCharge } from "../models/loan-charge.entity";
import { TLoanFilters } from "../models/types/ISearchFilters";
import { getElSalvadorDateObject, getElSalvadorTime } from "../utils/dataTime";
import { ErrorCodes } from "../error/errorCodes";
import { NotFoundError } from "../error/not-found.error";
import { ConflictError } from "../error/conflict.error";
import { ILockerRepository } from "../repository/interfaces/locker-repository.interface";
import { LoanLocker } from "../models/loan-locker";
import { LoanLockerRepository } from "../repository/loan-locker.repository";
import { TLockerLoanResponse } from "../models/types/ILoans";
import { toLockerLoanResponse } from "../helper/toLoanResponse";
import { ILoanLockerService } from "./interfaces/loan-locker-service.interface";
import { toPagination } from "../helper/toPagination";

export class LoanLockerService implements ILoanLockerService {
  constructor(
    private chargeRepository: LoanChargeRepository,
    private releaseRepository: LoanReleaseRepository,
    private lockerRepository: ILockerRepository,
    private userRepository: IUserRepository,
    private loanRepository: LoanRepository,
    private loanLockerRepository: LoanLockerRepository,
  ) {}

  public chargeLoan = async (
    librarin: UserData,
    userId: string,
    lockerId: number,
  ) => {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundError(ErrorCodes.USER.NOT_FOUND);
    if (user.state === UserStates.INACTIVE)
      throw new ConflictError(ErrorCodes.USER.INACTIVE);

    const locker = await this.lockerRepository.findById(lockerId);
    if (!locker) throw new NotFoundError(ErrorCodes.LOCKER.NOT_FOUND);
    if (locker.state !== ResourceStates.FREE)
      throw new ConflictError(ErrorCodes.LOCKER.IN_USE);

    const activeLoan = await this.loanRepository.findActiveLockerLoansByUser(
      user.id,
    );
    if (activeLoan.length > 0)
      throw new ConflictError(ErrorCodes.LOAN.ACTIVE_EXISTS);

    const loan = new Loan();
    loan.user = user;
    loan.date = getElSalvadorDateObject();
    const savedLoan = await this.loanRepository.save(loan);

    const loanLocker = new LoanLocker();
    loanLocker.loan = savedLoan;
    loanLocker.locker = locker;
    await this.loanLockerRepository.save(loanLocker);

    const charge = new LoanCharge();
    charge.librarian = librarin;
    charge.loan = savedLoan;
    charge.startTime = getElSalvadorTime();

    locker.state = ResourceStates.OCCUPIED;
    await this.lockerRepository.save(locker);
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

    const locker = loan.loanLocker.locker;
    locker.state = ResourceStates.FREE;
    await this.lockerRepository.save(locker);
    await this.releaseRepository.save(release);
  };

  public find = async (
    filters: TLoanFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<TLockerLoanResponse>> => {
    const { data: loans, total } = await this.loanRepository.findLockerLoans(
      filters,
      page,
      limit,
    );
    const data: TLockerLoanResponse[] = loans.map(toLockerLoanResponse);
    return {
      data,
      pagination: toPagination(total, page, limit)
    };
  };
}
