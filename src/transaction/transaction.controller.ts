import { Body, Controller, Get,Param, Post, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetCurrentUserId } from 'src/decorators/get-current-user-id.decorators';

@Controller('transaction')
@ApiTags('Transactions')
@ApiBearerAuth('bearer')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('/transactions/:publicKey')
  async getUserTransactions(@Param('publicKey') publicKey: string) {
      const transactions = await this.transactionService.fetchUserTransactions(publicKey);
      return transactions;
  }

  @Post('sendPayment')
  @UseGuards(JwtAuthGuard)
  async issueAsset(@Body() createTransactionDto: CreateTransactionDto, @GetCurrentUserId() userId:string) {
    const {destinationPublicKey,amount } = createTransactionDto;
    return await this.transactionService.sendPayment(destinationPublicKey,amount,userId );
  }
}
