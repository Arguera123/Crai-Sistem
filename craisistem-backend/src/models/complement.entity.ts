import { 
  Column, 
  Entity, 
  JoinColumn, 
  ManyToOne, 
  PrimaryGeneratedColumn 
} from "typeorm";
import { Device } from "./device.entity";

@Entity({ name: "complement" })
export class Complement{
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  name: string

  @Column()
  brand: string

  @Column()
  state: string

  @Column()
  model: string

  @Column()
  inventary: string

  @ManyToOne(() => Device)
  @JoinColumn({ name: "device_id" })
  device: Device  
}