import { 
  Column,
  Entity, 
  PrimaryColumn, 
  PrimaryGeneratedColumn 
} from "typeorm";
import { ResourceStates } from "../utils/states.constant";

export enum OSEnum {
  WINDOWS = "windows",
  MAC = "mac",
  LINUX = "linux"
}
@Entity({ name: "device" })
export class Device{
  @PrimaryGeneratedColumn("increment")
  id: number

  @Column()
  brand: string

  @Column({ type: 'enum', enum: ResourceStates, nullable: false, default: ResourceStates.FREE })
  state: string

  @Column()
  section: string 

  @Column()
  model: string

  @Column()
  inventory: string

  @Column({ type: 'enum', enum: OSEnum, nullable: false })
  operatingSystem: string
}