import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import { UserData } from "./user.entity";
import { Loan } from "./loan.entity";

@Entity({ name: "loan_release" })
export class LoanRelease {
  @PrimaryColumn({ name: "librarian_id" })
  librarianId: string

  @PrimaryColumn({ name: "loan_id" })
  loanId: string

  @ManyToOne(() => UserData)
  @JoinColumn({ name: "librarian_id" })
  librarian: UserData

  @OneToOne(() => Loan, loan => loan.release)
  @JoinColumn({ name: "loan_id" })
  loan: Loan

  @Column({
      type: "time",
      name: "end_time",
    })
  endTime: string  
}