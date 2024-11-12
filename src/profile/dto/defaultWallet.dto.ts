import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsNumber } from "class-validator";

export class DefaultWalletDto{
    @IsString()
    @IsNotEmpty()
    @ApiProperty({type:String, description:'walletName'})
    walletName:string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({type:String, description:'currency'})
    currency:string;

    @IsNotEmpty()
    @ApiProperty({ type: Boolean, description: 'isDefault' })
    isDefault: boolean;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({type:Number, description:'balance'})
    balance:number;
}
