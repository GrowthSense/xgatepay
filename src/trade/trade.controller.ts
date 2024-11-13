import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { TradeService } from './trade.service';
import { CreateTradeDto } from './dto/create-trade.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetOrderBookDto } from './dto/get-trade-book.dto';
import { GetCurrentUserId } from 'src/decorators/get-current-user-id.decorators';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('trade')
@ApiTags('Trade')
@ApiBearerAuth('bearer')
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  @Post('create-offer')
  @UseGuards(JwtAuthGuard)
  async createOffer(@Body() createOfferDto: CreateTradeDto, @GetCurrentUserId() userId:string) {
    const { sellingAssetCode, buyingAssetCode, amount, price } = createOfferDto;
    return this.tradeService.createOffer(sellingAssetCode, buyingAssetCode, amount, price, userId);
  }

  @Get('orderbook')
  async getOrderBook(@Query() getOrderBookDto: GetOrderBookDto) {
    const { sellingAssetCode, issuingAccountSecret } = getOrderBookDto;
    return this.tradeService.getOrderBook(sellingAssetCode, issuingAccountSecret);
  }

  // @Get('all')
  // async getAllAssets() {
  //   const assets = await this.tradeService.getAllAssets();
  //   return assets;
  // }

  // @Get('by-codes/:assetCodes')
  // async getAssetsByCode(@Param('assetCodes') assetCodes: string) {
  //   const assetCodesArray = assetCodes.split(',');
  //   const assets = await this.tradeService.getAssetsByCode(assetCodesArray);
  //   return assets;
  // }
}
