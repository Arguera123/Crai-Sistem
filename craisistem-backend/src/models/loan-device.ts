import { Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import { Loan } from "./loan.entity";
import { Device } from "./device.entity";

@Entity({ name: "loan_device" })
export class LoanDevice {
  @PrimaryColumn({ name: "loan_id" })
  loanId: string

  @PrimaryColumn({ name: "device_id" })
  deviceId: number

  @OneToOne(() => Loan, loan => loan.loanDevice)
  @JoinColumn({ name: "loan_id" })
  loan: Loan

  @ManyToOne(() => Device)
  @JoinColumn({ name: "device_id"})
  device: Device
}