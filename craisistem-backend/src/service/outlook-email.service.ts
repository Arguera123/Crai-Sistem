import nodemailer from 'nodemailer';
import { IEmailSender } from './interfaces/email-service.interface';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export class OutlookEmailSender implements IEmailSender {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options>;

  constructor(
    private readonly fromEmail: string,
    private readonly password: string
  ) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: {
        user: this.fromEmail,
        pass: this.password,
      },
      tls: {
        ciphers: 'SSLv3'
      }
    });
  }

  async send(to: string, subject: string, html: string): Promise<void> {
    await this.transporter.sendMail({
      from: this.fromEmail,
      to,
      subject,
      html
    });
  }
}
