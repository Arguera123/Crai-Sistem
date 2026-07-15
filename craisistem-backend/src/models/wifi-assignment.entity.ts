import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
import { UserData } from "./user.entity";
import { WifiUser } from "./wifi-user.entity";

@Entity({ name: "wifi_assignment" })
export class WifiAssignment {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
  timestamp: Date

  @ManyToOne(() => UserData)
  @JoinColumn({ name: "librarian_id" })
  librarian: UserData

  @ManyToOne(() => UserData)
  @JoinColumn({ name: "user_id" })
  user: UserData

  @ManyToOne(() => WifiUser)
  wifiUser: WifiUser
}