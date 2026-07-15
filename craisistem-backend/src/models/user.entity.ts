import { 
  Entity,
  Column,
  PrimaryColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Role } from "./role.entity";
import { UserStates } from "../utils/states.constant";
import { UserType } from "../utils/user-type.constants";

@Entity({ name: "user_data" })
export class UserData {
  @PrimaryColumn({
    name: "id",
    type: "varchar",
    length: 15
  })
  id: string

  @Column({ 
    name: "first_name",
    nullable: false 
  })
  firstName: string

  @Column({ 
    name: "last_name",
    nullable: false 
  })
  lastName: string

  @Column({ 
    name: "email",
    nullable: false 
  })
  email: string

  @Column({ 
    nullable: false 
  })
  gender: string

  @Column({ 
    type: "enum",
    enum: UserType,
    nullable: false,
    name: "type"
  })
  type: string

  @Column({
    nullable: false,
  })
  faculty: string

  @Column({
    name: "token",
    nullable: true
  })
  token: string

  @Column({
    type: "date",
    name: "expiration_date",
    default: () => "CURRENT_DATE"
  })
  expirationDate: Date

  @Column({
    name: "photo",
    nullable: true
  })
  photo: string

  @Column({
    type: "enum",
    enum: UserStates,
    nullable: false,
    default: UserStates.ACTIVE
  })
  state: string

  @ManyToMany(() => Role, { cascade: ["insert", "update"], eager: true })
  @JoinTable({
    name: "user_x_role",
    joinColumn: {
      name: "user_id",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "role_id",
      referencedColumnName: "id"
    }
  })
  roles: Role[]
}