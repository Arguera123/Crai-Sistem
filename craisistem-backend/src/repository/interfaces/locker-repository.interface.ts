import { Locker } from "../../models/locker.entity";

export interface ILockerRepository {
  save(locker: Locker): void
  findById(id: number): Promise<Locker>
  find(
    page?: number,
    limit?: number
  ): Promise<{ data: Locker[], total: number }>
}