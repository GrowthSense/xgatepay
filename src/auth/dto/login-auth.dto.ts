import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class LoginAuthDto{
    @IsNotEmpty()
    @ApiProperty({type:String, description:'cashtag'})
    email:string;

    @IsNotEmpty()
    @ApiProperty({type:String, description:'pin'})
    pin:string;
}