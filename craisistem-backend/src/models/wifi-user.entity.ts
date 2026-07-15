import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { WifiAssignment } from "./wifi-assignment.entity";

@Entity({ name: "wifi_user" })
export class WifiUser {
  @PrimaryColumn({
    type: "varchar",
    length: 8
  })
  id: string

  @Column()
  password: string

  @Column({
    type: "date",
    name: "creation_date",
    default: () => "CURRENT_DATE"
  })
  creationDate: Date

  @Column({
    type: "date",
    name: "expiration_date",
    default: () => "CURRENT_DATE"
  })
  expirationDate: Date

  @OneToMany(() => WifiAssignment, assignment => assignment.wifiUser)
  assignments: WifiAssignment[]
}