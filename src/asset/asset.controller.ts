import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AssetService } from './asset.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateTrustlineDto } from './dto/create-trustline.dto';
import { CreateTransactionDto } from 'src/transaction/dto/create-transaction.dto';

@ApiTags('Asset')
@Controller('asset')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post('trustline')
  async createTrustline(@Body() createTrustlineDto: CreateTrustlineDto) {
    const { assetCode, recipientPublicKey, recipientSecretKey, issuerSecretKey} = createTrustlineDto;
    return await this.assetService.createTrustline(assetCode, recipientPublicKey, recipientSecretKey, issuerSecretKey);

  }

  @Post('issueAsset')
  async issueAsset(@Body() createAssetDto: CreateAssetDto) {
    const { assetCode, amount, recipientPublicKey, issuerPublicKey } = createAssetDto;
    return await this.assetService.issueAsset(assetCode, amount, recipientPublicKey, issuerPublicKey);
  }

 
  


}
