import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import StellarSdk, {Asset, Horizon, Keypair} from '@stellar/stellar-sdk';
import { ProfileService } from 'src/profile/profile.service';

@Injectable()
export class TransactionService {

  private server: Horizon.Server;

  constructor(private profileService:ProfileService) {
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

  async sendPayment(destinationPublicKey: string, amount: string, userId:string) {
   

    const traderKeyPair=await this.profileService.getProfileById(userId)
    const sourcePair=Keypair.fromSecret(traderKeyPair.secretKey)

    const server = new StellarSdk.Horizon.Server(
      "https://horizon-testnet.stellar.org",
   
    );


    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      throw new BadRequestException('Amount must be a positive number');
    }

    const amountString = parseFloat(amount).toFixed(7);

    try {
      const sourceAccount = await server.loadAccount(sourcePair.publicKey());
      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: 'Test SDF Network ; September 2015',
      })
        .addOperation(
          StellarSdk.Operation.payment({
            destination: destinationPublicKey,
            asset: Asset.native(),
            amount: amountString,
          })
        )
        .setTimeout(30)
        .build();

      transaction.sign(sourcePair);
      const result = await server.submitTransaction(transaction);
      return result;
  
    } catch (error) {
      throw new BadRequestException(`Error sending payment: ${error.message}`);
    }
  }
}
