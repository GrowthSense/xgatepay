import { ApiProperty } from "@nestjs/swagger";
import {IsString } from "class-validator";

export class UserProfileDto {
   @IsString()
   @ApiProperty({type:String, description:"firstaname"})
   firstname:string;

   @IsString()
   @ApiProperty({type:String, description:"lastname"})
   lastname:string;
}