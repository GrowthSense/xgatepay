import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateTransactionDto {
    @IsString()
    @ApiProperty()
    destinationPublicKey: string;


    @IsString()
    @ApiProperty()
    amount: string;

   
}
