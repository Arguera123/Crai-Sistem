import PostgresDataSource from "../config/db.config";
import { Locker } from "../models/locker.entity";
import { ResourceStates } from "./states.constant";

export const seedLockers = async () => {
  const lockerRepo = PostgresDataSource.getRepository(Locker);

  const count = await lockerRepo.count();

  if (count >= 140) {
    console.log("Seeding omitido: Ya existen 140 o más lockers.");
    return;
  }

  const remaining = 140 - count;
  const lockers: Partial<Locker>[] = [];

  for (let i = 1; i <= remaining; i++) {
    lockers.push({
      state: ResourceStates.FREE
    });
  }

  await lockerRepo.save(lockers);
  console.log(`${remaining} lockers nuevos creados.`);
};