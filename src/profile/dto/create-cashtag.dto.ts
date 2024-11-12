import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateCashTagDto{
    @IsString()
    @ApiProperty({type:String, description:'cashtag'})
    cashtag:string;
}