import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserData } from "./user.entity";
import { Roles } from "../utils/roles.constant";

@Entity({ name: "role" })
export class Role {
  @PrimaryGeneratedColumn("uuid")
  id: string 

  @Column({ type: 'enum', enum: Roles, nullable: false, default: Roles.USER, unique: true })
  name: Roles

  @ManyToMany(() => UserData, user => user.roles)
  users: UserData[]
}