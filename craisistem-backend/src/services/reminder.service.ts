import { IEmailSender } from "./interfaces/email-service.interface";
import { UserData } from "../models/user.entity";
import { Loan } from "../models/loan.entity";
import { LoanRepository } from "../repository/loan.repository";

export class ReminderService {
  constructor(
    private readonly loanRepo: LoanRepository,
    private readonly emailSender: IEmailSender
  ) {}

  async sendDailyReminders(): Promise<void> {
    const activeLoans: Loan[] = await this.loanRepo.findActiveLoans()

    for (const loan of activeLoans) {
      const user: UserData = loan.user;
      await this.emailSender.send(
        user.email,
        "Recordatorio de devolución de préstamo",
        `<p>Hola ${user.firstName}, recuerda devolver tu préstamo antes de las 6:00 p. m. de hoy.</p>`
      );
    }
  }
}