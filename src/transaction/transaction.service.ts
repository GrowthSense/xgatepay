import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import StellarSdk, {Asset, Horizon, Keypair} from '@stellar/stellar-sdk';

@Injectable()
export class TransactionService {

  private server: Horizon.Server;

  constructor() {
    this.server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
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

  async sendPayment(sourcePublicKey: string, destinationPublicKey: string, amount: string, sourceSecretKey: string): Promise<object> {
   
    const sourceAccount = await this.server.loadAccount(sourcePublicKey).catch((error) => {
      throw new NotFoundException('Source account not found!');
    });
 try {
      await this.server.loadAccount(destinationPublicKey);
    } catch (error) {
      if (error instanceof StellarSdk.NotFoundError) {
        throw new NotFoundException('The destination account does not exist!');
      }
      throw new InternalServerErrorException('Failed to load destination account!');
    }

    // Step 3: Create the Stellar keypair from the source's secret key (provided as input)
    const sourceWallet = StellarSdk.Keypair.fromSecret(sourceSecretKey);

    // Step 4: Check if the source account has enough balance (optional but recommended)
    const amountNumber = parseFloat(amount);
    const balance = sourceAccount.balances.find((b) => b.asset_type === 'native'); // 'native' refers to Lumens (XLM)
    if (!balance || parseFloat(balance.balance) < amountNumber) {
      throw new BadRequestException('Insufficient balance in source account');
    }

    // Step 5: Build the payment transaction
    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET, // Change to Networks.PUBLIC for mainnet
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: destinationPublicKey,
          asset: Asset.native(), // XLM (Lumens) is the native currency
          amount,
        })
      )
      .addMemo(StellarSdk.Memo.text('Wallet-to-wallet transfer'))
      .setTimeout(180)
      .build();

    // Step 6: Sign the transaction
    transaction.sign(sourceWallet);

    // Step 7: Submit the transaction to Stellar network
    try {
      const result = await this.server.submitTransaction(transaction);
      console.log('Transaction successful:', result);

      // Step 8: Return the result containing transaction hash and success message
      return {
        status: 'Transaction successful',
        transactionHash: result.hash,
      };
    } catch (error) {
      console.error('Error sending payment:', error);
      throw new InternalServerErrorException('Failed to send payment');
    }
  }
}
