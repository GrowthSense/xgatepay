import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports:[
    MailerModule.forRoot({
      transport: {
        host: "smtp.webregisteronline.com",
        secure: true,
        auth: {
          user: "info@webregisteronline.com",
          pass: "12345678#",
        },
      },
      defaults: {
        from: '"No Reply" <info@webregisteronline.com>',
      },
    }),
  ],
  
  providers: [MailService],
  exports:[MailService]
})
export class MailModule {}
