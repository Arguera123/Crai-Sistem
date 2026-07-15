import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserData } from "./user.entity";
import { LoanCharge } from "./loan-charge.entity";
import { LoanRelease } from "./loan-release.entity";
import { LoanDevice } from "./loan-device";
import { LoanLocker } from "./loan-locker";

@Entity({ name: "loan" })
export class Loan{
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({
    type: "date",
    name: "date",
  })
  date: Date

  @ManyToOne(() => UserData)
  @JoinColumn({ name: "user_id" })
  user: UserData

  @OneToOne(() => LoanCharge, charge => charge.loan)
  charge: LoanCharge

  @OneToOne(() => LoanRelease, release => release.loan)
  release: LoanRelease

  @OneToOne(() => LoanDevice, loanDevice => loanDevice.loan)
  loanDevice: LoanDevice

  @OneToOne(() => LoanLocker, loanLocker => loanLocker.loan)
  loanLocker: LoanLocker
}