import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class CreateUserSignUpDto {
    @IsOptional()
    @ApiProperty({type:String, description:'email'})
    email:string;

    @IsOptional()
    @ApiProperty({type:String, description:'phonenumber'})
    phonenumber:string;
}
