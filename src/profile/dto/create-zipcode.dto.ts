import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateZicodeDto{
    @IsString()
    @ApiProperty({type:String, description:'zipcode'})
    zipcode:string;
}