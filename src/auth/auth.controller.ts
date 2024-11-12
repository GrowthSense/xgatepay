import { Controller, Get, Post, Body,UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { CreateUserSignUpDto } from './dto/create-user-signup.dto';
import { UserOtpDto } from './dto/user-otp.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  async login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.signIn(loginAuthDto)
  }

  @Post('/signup')
  async signUp(@Body() createUserSignUpDto: CreateUserSignUpDto): Promise<any> {
    return this.authService.signUp(createUserSignUpDto);
  }
  
  @Post('verify-otp')
  async verifyOtp(@Body() otpDto: UserOtpDto): Promise<any> {
    return await this.authService.verifyOtp(otpDto.email, otpDto.otp);
  }
  @UseGuards(JwtAuthGuard)
  @Get()
  async test() {
    return "sucess"
  }
}
