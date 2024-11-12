import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, Matches, Validate } from "class-validator";

export class UserOtpDto {
    @Validate((obj, value) => {
        if (!value && !obj.phone) {
            return false; // Either email or phone is required
        }
        return true;
    })
    @IsOptional()
    @IsEmail()
    @ApiProperty({ type: String, description: 'email' })
    email: string;

    @Validate((obj, value) => {
        if (!value && !obj.email) {
            return false; // Either email or phone is required
        }
        return true;
    })
    @Matches(/^[0-9]{10,15}$/, { message: 'Invalid phone number' })
    @IsOptional()
    @ApiProperty({ type: String, description: 'phone' })
    phonenumber: string;

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ type: String, description: 'otp' })
    otp: string;

}