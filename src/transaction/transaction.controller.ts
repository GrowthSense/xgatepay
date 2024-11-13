import { Controller, Get,Param } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('transaction')
@ApiTags('Transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('/transactions/:publicKey')
  async getUserTransactions(@Param('publicKey') publicKey: string) {
      const transactions = await this.transactionService.fetchUserTransactions(publicKey);
      return transactions;
  }
}
