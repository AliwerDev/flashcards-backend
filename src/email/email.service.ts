import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    const pass = atob(process.env.EMAIL_PASSWORD);

    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: pass,
      },
    });
  }

  async sendOtp(email: string, otp: string): Promise<void> {
    console.log(atob(process.env.EMAIL_PASSWORD));

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}.`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
