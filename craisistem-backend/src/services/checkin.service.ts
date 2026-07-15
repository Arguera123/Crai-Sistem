import createHttpError from "http-errors";
import { CheckinRepository } from "../repository/checkin.repository";
import { UserRepository } from "../repository/user.repository";
import { Checkin } from "../models/checkin.entity";
import { TCheckinFilters } from "../models/types/ISearchFilters";
import { TCheckinResponse } from "../models/types/ICheckin";
import { toCheckinResponse } from "../mappers/toCheckinResponse";
import { UserStates } from "../utils/states.constant";

export class CheckinService {
  constructor (
    private checkinRepository: CheckinRepository,
    private userRepository: UserRepository
  ) {}

  public save = async (userId: string) => {
    const user = await this.userRepository.findById(userId)
    if (!user) throw createHttpError(404, "Usuario no encontrado!")
    if (user.state !== UserStates.ACTIVE) throw createHttpError(409, 'El usuario no esta activo!')

    const checkin = new Checkin
    checkin.user = user

    const savedCheckin = await this.checkinRepository.save(checkin)

    return toCheckinResponse(savedCheckin)
  }

  public find = async (
    filters: TCheckinFilters,
    page: number = 1,
    limit: number = 10,
  ) => {
    const { data: checkins, total } = await this.checkinRepository.findWithFilters(filters, page, limit)

    const data: TCheckinResponse[] = checkins.map(toCheckinResponse)

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