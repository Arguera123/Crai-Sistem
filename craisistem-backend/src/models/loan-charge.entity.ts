import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import { Loan } from "./loan.entity";
import { UserData } from "./user.entity";

@Entity({ name: "loan_charge" })
export class LoanCharge {
  @PrimaryColumn({ name: "librarian_id" })
  librarianId: string

  @PrimaryColumn({ name: "loan_id"})
  loanId: string

  @ManyToOne(() => UserData)
  @JoinColumn({ name: "librarian_id" })
  librarian: UserData

  @OneToOne(() => Loan, loan => loan.charge)
  @JoinColumn({ name: "loan_id" })
  loan: Loan

  @Column({
      type: "time",
      name: "start_time",
    })
  startTime: string
}