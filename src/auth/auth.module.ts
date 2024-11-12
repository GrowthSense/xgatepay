import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { UserRepository } from './user.repository';
import { User } from './entities/users.entity';
import { TypeOrmModule } from 'src/database/typeorm-ex.module';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports:[
     TypeOrmModule.forCustomRepository([User,UserRepository]),
    JwtModule.registerAsync({
      imports:[ConfigModule],
      useFactory:async()=>({
        secret:process.env.JWT_SECRET,
      }),
      inject:[ConfigService]
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy, MailService]
})
export class AuthModule {}