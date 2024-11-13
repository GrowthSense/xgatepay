import { Body, Controller, Get,Param, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transaction')
@ApiTags('Transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('/transactions/:publicKey')
  async getUserTransactions(@Param('publicKey') publicKey: string) {
      const transactions = await this.transactionService.fetchUserTransactions(publicKey);
      return transactions;
  }

  @Post('sendPayment')
  async issueAsset(@Body() createTransactionDto: CreateTransactionDto) {
    const { sourceSecretKey, amount, destinationPublicKey, sourcePublicKey } = createTransactionDto;
    return await this.transactionService.sendPayment(sourceSecretKey, amount, destinationPublicKey, sourcePublicKey );
  }
}
