import createHttpError from "http-errors";
import { UserData } from "../models/user.entity";
import { UserRepository } from "../repository/user.repository";
import { LockerRepository } from "../repository/locker.repository";
import { TLoanFilters } from "../models/types/ISearchFilters";
import { ResourceStates, UserStates } from "../utils/states.constant";
import { PaginatedResponse } from "../models/types/IPaginatedResponse";
import { Loan } from "../models/loan.entity";
import { LoanRepository } from "../repository/loan.repository";
import { LoanCharge } from "../models/loan-charge.entity";
import { LoanChargeRepository } from "../repository/loan-charge.repository";
import { LoanLockerRepository } from "../repository/loan-locker.repository";
import { LoanLocker } from "../models/loan-locker";
import { LoanRelease } from "../models/loan-release.entity";
import { LoanReleaseRepository } from "../repository/loan-release.repository";
import { toLockerLoanResponse } from "../mappers/toLoanResponse";
import { TLockerLoanResponse } from "../models/types/ILoans";
import { CheckinRepository } from "../repository/checkin.repository";
import { Checkin } from "../models/checkin.entity";
import { getElSalvadorDateObject, getElSalvadorTime } from "../utils/dataTime";


export class LoanLockerService {
  constructor(
    private chargeRepository: LoanChargeRepository,
    private releaseRepository: LoanReleaseRepository,
    private lockerRepository: LockerRepository,
    private userRepository: UserRepository,
    private loanRepository: LoanRepository,
    private loanLockerRepository: LoanLockerRepository,
    private checkinRepository: CheckinRepository
  ) {}

  public chargeLoan = async (
    librarian : UserData, 
    userId : string, 
    lockerId : number
  ) => {
    const user = await this.userRepository.findById(userId)
    if (!user) throw createHttpError(404, 'Usuario no encontrado!')
    if (user.state === UserStates.INACTIVE) throw createHttpError(409, 'El usuario no esta inactivo!')

    const locker = await this.lockerRepository.findById(lockerId)
    if (!locker) throw createHttpError(404, 'Casillero no encontrado!')

    if (locker.state !== ResourceStates.FREE) throw createHttpError(409, "El casillero ya esta en uso")

    const activeLoan = await this.loanRepository.findActiveLockerLoansByUser(user.id)
    if (activeLoan.length > 0) throw createHttpError(409, 'El usuario ya tiene un prestamo activo')

    const loan = new Loan()
    loan.user = user
    loan.date = getElSalvadorDateObject()

    const savedLoan = await this.loanRepository.save(loan)

    const loanLocker = new LoanLocker()
    loanLocker.loan = savedLoan
    loanLocker.locker = locker

    await this.loanLockerRepository.save(loanLocker)

    const charge = new LoanCharge()
    charge.librarian = librarian
    charge.loan = savedLoan
    charge.startTime = getElSalvadorTime()

    const checkin = new Checkin
    checkin.user = user

    locker.state = ResourceStates.OCCUPIED
    
    await this.lockerRepository.save(locker)
    await this.checkinRepository.save(checkin)
    await this.chargeRepository.save(charge)
  }

  public releaseLoan = async (
    librarian: UserData,
    loanId: string
  ) => {
    const loan = await this.loanRepository.findById(loanId)
    if(!loan) throw createHttpError(404, 'Prestamo no encontrado!')

    if(loan.release) throw createHttpError(409, 'El prestamo ya se ha completado')

    const release = new LoanRelease()
    release.loan = loan
    release.librarian = librarian
    release.endTime = getElSalvadorTime()

    const locker = loan.loanLocker.locker
    locker.state = ResourceStates.FREE
    await this.lockerRepository.save(locker)

    await this.releaseRepository.save(release)
  }

  public find = async (
    filters: TLoanFilters,
    page: number,
    limit: number
  ): Promise<PaginatedResponse<TLockerLoanResponse>> => {
    const { data: loans, total } = await this.loanRepository.findLockerLoans(filters, page, limit)
    
    const data: TLockerLoanResponse[] = loans.map(toLockerLoanResponse)

    return {
      data,
      pagination: {
        total,
        limit,
        page,
        totalPages: Math.ceil(total/limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1
      }
    }
  }
}