import { Injectable } from '@nestjs/common';
import { Horizon } from '@stellar/stellar-sdk';


@Injectable()
export class TransactionService {

  private server: Horizon.Server;

  constructor() {
    this.server = new Horizon.Server('https://horizon-testnet.stellar.org');
  }

  async fetchUserTransactions(publicKey: string) {
    try {
      
  
      const transactions = await this.server.transactions()
        .forAccount(publicKey)
        .order('desc')
        .call();
  
      const formattedTransactions = transactions.records.map(transaction => ({
        id: transaction.id, 
        hash: transaction.hash,
        sourceAccount: transaction.source_account,
        successful:transaction.successful,
        date:transaction.created_at,
        fee_charged:transaction.fee_charged,
      }));
  
      return formattedTransactions;
    } catch (error) {
      throw new Error('Failed to fetch user transactions');
    }
  }
}
