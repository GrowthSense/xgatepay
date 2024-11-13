import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateTransactionDto {
    @IsString()
    @ApiProperty()
    sourcePublicKey: string;
    
    @IsString()
    @ApiProperty()
    sourceSecretKey: string;

    @IsString()
    @ApiProperty()
    destinationPublicKey: string;


    @IsString()
    @ApiProperty()
    amount: string;

   
}
