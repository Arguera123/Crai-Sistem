import { 
  Entity,
  Column,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { UserData } from "./user.entity";

@Entity({ name: "checkin" })
export class Checkin{
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({
    type: "date",
    name: "date",
    default: () => "CURRENT_DATE"
  })
  date: Date

  @Column({
    type: "time",
    name: "time",
    default: () => "CURRENT_TIME"
  })
  time: string

  @ManyToOne(() => UserData)
  @JoinColumn({ name: "user_id" })
  user: UserData
}

