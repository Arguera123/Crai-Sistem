import { Locker } from "../models/locker.entity";
import { LockerRepository } from "../repository/locker.repository";

export class LockerService {
  constructor(
    private lockerRepository: LockerRepository
  ) {}

  public save = async (num: number) => {
    const locker = new Locker
    await this.lockerRepository.save(locker)
  }

  public find = async (
    page: number = 1, 
    limit: number
  ) => {
    const { data, total} = await this.lockerRepository.find(page, limit)

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

  public findById = async (id : string) => {
    return await this.findById(id)
  }
}