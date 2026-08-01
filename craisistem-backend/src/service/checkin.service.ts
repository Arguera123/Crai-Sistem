import { Checkin } from "../models/checkin.entity";
import { TCheckinFilters } from "../models/types/ISearchFilters";
import { TCheckinResponse } from "../models/types/ICheckin";
import { toCheckinResponse } from "../helper/toCheckinResponse";
import { UserStates } from "../utils/states.constant";
import { NotFoundError } from "../error/not-found.error";
import { ErrorCodes } from "../error/errorCodes";
import { ICheckinService } from "./interfaces/checkin-service.interface";
import { ICheckinRepository } from "../repository/interfaces/checking-repository.interface";
import { IUserRepository } from "../repository/interfaces/user-repository.interface";
import { toPagination } from "../helper/toPagination";

export class CheckinService implements ICheckinService {
  constructor (
    private checkinRepository: ICheckinRepository,
    private userRepository: IUserRepository
  ) {}

  public save = async (userId: string) => {
    const user = await this.userRepository.findById(userId)
    if (!user) throw new NotFoundError(ErrorCodes.USER.NOT_FOUND)
    if (user.state !== UserStates.ACTIVE) throw new NotFoundError(ErrorCodes.USER.INACTIVE)

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
      pagination: toPagination(total, page, limit)
    }
  }
}