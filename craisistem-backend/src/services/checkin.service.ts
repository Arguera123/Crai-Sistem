import createHttpError from "http-errors";
import { CheckinRepository } from "../repository/checkin.repository";
import { UserRepository } from "../repository/user.repository";
import { Checkin } from "../models/checkin.entity";
import { TCheckinFilters } from "../models/types/ISearchFilters";
import { TCheckinResponse } from "../models/types/ICheckin";
import { toCheckinResponse } from "../mappers/toCheckinResponse";
import { UserStates } from "../utils/states.constant";
import { getElSalvadorDateObject, getElSalvadorTime } from "../utils/dataTime";

export class CheckinService {
  constructor (
    private checkinRepository: CheckinRepository,
    private userRepository: UserRepository
  ) {}

  public save = async (userId: string) => {
    const user = await this.userRepository.findById(userId)
    if (!user) throw createHttpError(404, "Usuario no encontrado!")
    if (user.state !== UserStates.ACTIVE) throw createHttpError(409, 'El usuario esta inactivo!')

    const checkin = new Checkin
    checkin.user = user
    // Fecha y hora de El Salvador (CURRENT_DATE de Postgres usa la zona del servidor, normalmente UTC)
    checkin.date = getElSalvadorDateObject()
    checkin.time = getElSalvadorTime()

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