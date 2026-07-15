import { Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import { Loan } from "./loan.entity";
import { Locker } from "./locker.entity";

@Entity({ name: "loan_locker" })
export class LoanLocker {
  @PrimaryColumn({ name: "loan_id" })
  loanId: string

  @PrimaryColumn({ name: "locker_id" })
  lockerId: number

  @OneToOne(() => Loan, loan => loan.loanLocker)
  @JoinColumn({ name: "loan_id" })
  loan: Loan

  @ManyToOne(() => Locker)
  @JoinColumn({ name: "locker_id" })
  locker: Locker
}