import cron from 'node-cron';
import { ReminderService } from '../service/reminder.service';
import { IEmailSender } from '../service/interfaces/email-service.interface';
import { LoanRepository } from '../repository/loan.repository';
import { OutlookEmailSender } from '../service/outlook-email.service';
import dotenv from "dotenv";
dotenv.config();

export const scheduleReminderJob = () => {
  cron.schedule('58 6 * * *', async () => {
    try {
      const user: string = process.env.OUTLOOK_USER
      const password: string = process.env.OUTLOOK_PASSWORD
      const emailSender: IEmailSender = new OutlookEmailSender(user, password);

      const loanRepo = new LoanRepository()
      const reminderService = new ReminderService(loanRepo, emailSender);

      await reminderService.sendDailyReminders();
      console.log("Correos enviados");
    } catch (err) {
      console.log("Error al mandar los emails: ", err)
    }
  });
};
