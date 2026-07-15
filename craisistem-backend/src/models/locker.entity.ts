import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ResourceStates } from "../utils/states.constant";

@Entity({ name: "locker" })
export class Locker {
  @PrimaryGeneratedColumn("increment")
  id: number

  @Column({
    type: "enum",
    enum: ResourceStates,
    nullable: false,
    default: ResourceStates.FREE,
  })
  state: ResourceStates;
}
