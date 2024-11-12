import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserSignUpDto } from './dto/create-user-signup.dto';
import { User } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import * as argon2 from 'argon2'
import { LoginAuthDto } from './dto/login-auth.dto';
import { Keypair } from '@stellar/stellar-sdk';

const generator = require('generate-password');
const randtoken = require('rand-token');
@Injectable()
export class AuthService {

  constructor(@InjectRepository(UserRepository) private usersRepository: UserRepository, private jwtService: JwtService, private mailService: MailService) { }


  async signUp(createUserSignUpDto: CreateUserSignUpDto): Promise<User> {
    const { email, phonenumber } = createUserSignUpDto;
    const otp = this.generateOtp();
    const pin = this.generatePin();

    const pair=Keypair.random();
    const publicKey=pair.publicKey()
    const secretKey=pair.secret()
    console.log("Secret Key",secretKey)

    try {
      const user = await this.usersRepository.findOne({ where: { email } });
      if (!user) {
        const result = await this.usersRepository.createUser(createUserSignUpDto, otp, pin, publicKey, secretKey);
        await this.mailService.sendOtp(result, otp);
        await this.mailService.sendPin(result, pin);
        return result;
      } else {
        throw new ConflictException('This user already exists');
      }
    } catch (error) {
      throw new InternalServerErrorException('Error signing up user');
    }
  }
  async signIn(loginAuthDto: LoginAuthDto) {
    try {
      const user = await this.findByEmail(loginAuthDto.email);
      await this.verifyPin(loginAuthDto.pin, user.pin);
      if (user.isVerified !== true) {
        throw new HttpException("User does not exist", HttpStatus.UNAUTHORIZED)
      }
      user.pin = undefined;
      const payload = {
        userId: user.id,
        cashtag: user.cashtag,
        name: user.firstname + " " + user.lastname
      };
      const refresh = await this.generateRefreshToken(user.id);

      return { access_token: this.jwtService.sign(payload), refreshToken: refresh, user: user.id }
    } catch (error) {
      throw new HttpException("Wrong credentials", HttpStatus.BAD_REQUEST)
    }
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new HttpException("Email doesn't exist", HttpStatus.BAD_REQUEST)
    }
    return user;
  }

  async findByUserId(id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException("User doesn't exist", HttpStatus.BAD_REQUEST)
    }
    return user;
  }

  async verifyOtp(email: string, enteredOtp: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user || user.otp !== enteredOtp) {
      throw new UnauthorizedException('Invalid OTP');
    }
    user.isVerified = true;
    user.otp = null;

    await this.usersRepository.save(user);
   
    const payload = {
      userId: user.id,
      email: user.email
    };
    const refresh = await this.generateRefreshToken(user.id);

    return { access_token: this.jwtService.sign(payload), refreshToken: refresh }

  }
  

  private generateOtp(): string {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return otp;
  }

  private generatePin() {
    const pin = generator.generate({
      length: 4,
      numbers: true,
      symbols: false,
      uppercase: false,
      lowercase: false,
      excludeSimilarCharacters: true,
    });
    return pin;
  }

  async saveOrUpdateRefreshToken(
    refreshToken: string,
    id: string,
    refreshTokenExpires: string
  ) {
    const user = await this.usersRepository.findOne({ where: { id } });
    user.refreshToken = refreshToken;
    user.refreshTokenExpires = refreshTokenExpires;
    await this.usersRepository.save(user);
    return user;
  }

  async generateRefreshToken(userId: string): Promise<string> {
    const refreshToken = randtoken.generate(16);
    const expirydate = new Date();
    expirydate.setDate(expirydate.getDate() + 6);
    const expiryDateString = expirydate.toISOString();

    await this.saveOrUpdateRefreshToken(refreshToken, userId, expiryDateString);
    return refreshToken;
  }
  public async verifyPin(plainTextPin: string, hashedPin: string) {
    const isPinMatching = await argon2.verify(plainTextPin, hashedPin);
    if (!isPinMatching) throw new HttpException("Wrong credentials", HttpStatus.BAD_REQUEST)
  }
}
