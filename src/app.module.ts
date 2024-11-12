import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { ProfileModule } from './profile/profile.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "fileStorage"),
      exclude: ["/api*"],
      renderPath: "/",
    }),
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`, '.env'],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot({ isGlobal: true })],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const isProduction = ["prod", "staging"].includes(
          configService.get("STAGE")
        );
        return {
          ssl: isProduction,
          extra: {
            ssl: isProduction ? { rejectUnauthorized: false } : null,
          },
          type: "postgres",
          host: configService.get("DB_HOST"),
          port: configService.get("DB_PORT"),
          username: configService.get("DB_USER"),
          password: configService.get("DB_PASSWORD"),
          database: configService.get("DB_DATABASE"),
          entities: [join(__dirname, "**", "*.entity.{ts,js}")],
          autoLoadEntities: true,
          synchronize: true,
          logging: true,
        };
      },
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    AuthModule,
    MailModule,
    ProfileModule,
    WalletModule
  ],
})
export class AppModule { }