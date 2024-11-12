import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UserOtpDto {
    @IsNotEmpty()
    @ApiProperty({type:String, description:'email'})
     otp:string;

     @IsOptional()
     @IsEmail()
     @IsString()
     @ApiProperty({type:String, description:"email"})
     email:string;

     @IsOptional()
     @IsString()
     @ApiProperty({type:String, description:"phonenumber"})
     phonenumber:string;
}
