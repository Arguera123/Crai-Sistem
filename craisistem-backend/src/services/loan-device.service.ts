import { UserData } from "../models/user.entity";
import createHttpError from "http-errors";
import { ResourceStates, UserStates } from "../utils/states.constant";
import { IDeviceRepository } from "../repository/interfaces/device-repository.interface";
import { IUserRepository } from "../repository/interfaces/user-repository.interface";
import { PaginatedResponse } from "../models/types/IPaginatedResponse";
import { LoanRepository } from "../repository/loan.repository";
import { LoanDeviceRepository } from "../repository/loan-device.repository";
import { LoanDevice } from "../models/loan-device";
import { Loan } from "../models/loan.entity";
import { LoanChargeRepository } from "../repository/loan-charge.repository";
import { LoanRelease } from "../models/loan-release.entity";
import { LoanReleaseRepository } from "../repository/loan-release.repository";
import { LoanCharge } from "../models/loan-charge.entity";
import { TLoanFilters } from "../models/types/ISearchFilters";
import { toDeviceLoanResponse } from "../mappers/toLoanResponse";
import { TDeviceLoanResponse } from "../models/types/ILoans";
import { getElSalvadorDateObject, getElSalvadorTime } from "../utils/dataTime";

export class LoanDeviceService {
  constructor(
    private chargeRepository: LoanChargeRepository,
    private releaseRepository: LoanReleaseRepository,
    private deviceRepository: IDeviceRepository,
    private userRepository: IUserRepository,
    private loanRepository: LoanRepository,
    private loanDeviceRepository: LoanDeviceRepository
  ) {}

  public chargeLoan = async (
    librarin: UserData, 
    userId: string, 
    deviceId: number
  ) => {
    const user = await this.userRepository.findById(userId) 
    if (!user) throw createHttpError(404, 'Usuario no entontrado!')
    if (user.state === UserStates.INACTIVE) throw createHttpError(409, 'El usuario no esta inactivo!')

    const device = await this.deviceRepository.findById(deviceId)
    if (!device) throw createHttpError(404, 'Equipo no encontrado!')

    if (device.state !== ResourceStates.FREE) throw createHttpError(409, "El equipo ya esta en uso")

    const activeLoan = await this.loanRepository.findActiveDeviceLoansByUser(user.id)
    if (activeLoan.length > 0) throw createHttpError(409, 'El usuario ya tiene un prestamo activo')

    const loan = new Loan()
    loan.user = user
    loan.date = getElSalvadorDateObject()

    const savedLoan = await this.loanRepository.save(loan)

    const loanDevice = new LoanDevice()
    loanDevice.loan = savedLoan
    loanDevice.device = device

    await this.loanDeviceRepository.save(loanDevice)
    
    const charge = new LoanCharge()
    charge.librarian = librarin
    charge.loan = savedLoan
    charge.startTime = getElSalvadorTime()
    
    device.state = ResourceStates.OCCUPIED
    await this.deviceRepository.save(device)

    await this.chargeRepository.save(charge)
  }

  public releaseLoan = async (
    librarian: UserData,
    loanId: string
  ) => {
    const loan = await this.loanRepository.findById(loanId)
    if(!loan) throw createHttpError(404, 'Prestamo no encontrado!')

    if(loan.release) throw createHttpError(409, 'El prestamo ya ha se ha completado!')

    const release = new LoanRelease();
    release.loan = loan
    release.librarian = librarian
    release.endTime = getElSalvadorTime()

    const device = loan.loanDevice.device
    device.state = ResourceStates.FREE
    await this.deviceRepository.save(device)

    await this.releaseRepository.save(release)
  }

  public find = async (
    filters: TLoanFilters,
    page: number,
    limit: number
  ): Promise<PaginatedResponse<TDeviceLoanResponse>> => {
    const { data: loans, total } = await this.loanRepository.findDeviceLoans(filters, page, limit)

    const data: TDeviceLoanResponse[] = loans.map(toDeviceLoanResponse)

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