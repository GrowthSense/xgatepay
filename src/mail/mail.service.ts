
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/auth/entities/users.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendOtp(user: User, otp: string) {
    if (user && user.email) {
      const send = await this.mailerService.sendMail({
        to: user.email,
        subject: 'Your Otp Verification code',
        text: `Please enter your otp: ${otp}.`,
      });
      return send;
    } else {
    
      console.error('User or email is null or undefined');
      return null; 
    }
  }

  async sendPin(user: User, pin: number) {
    
    if (user && user.email) {
      const send = await this.mailerService.sendMail({
        to: user.email,
        subject: 'Your pin',
        text: `You pin is: ${pin}.`,
      });
      return send;
    } else {
     
      console.error('User or email is null or undefined');
      return null; 
    }
  }
}
