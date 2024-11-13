import {  Injectable, Logger } from '@nestjs/common';
import { Asset, BASE_FEE, Horizon, Keypair, Networks, Operation, TransactionBuilder } from '@stellar/stellar-sdk';
import axios from 'axios';
import { ProfileService } from 'src/profile/profile.service';

@Injectable()
export class TradeService {

  private readonly logger = new Logger(TradeService.name);
  private server: Horizon.Server;
  private issuerKeypair: Keypair;

  constructor(private profileService:ProfileService) {
    //const stellarNetwork = this.configService.get<string>('STELLAR_NETWORK') === 'TESTNEST'? Networks.PUBLIC: Networks.TESTNET;

    this.server = new Horizon.Server('https://horizon-testnet.stellar.org')

  }

  async createOffer(
    sellingAssetCode: string,
    buyingAssetCode: string,
    amount: string,
    price: string,
    userId:string
  ) {
    const issuingKeypair = Keypair.fromSecret("SAUNM2GRWZNVVN7LXNXCJJJ4HNLSVHPRVS4SNF3TBKWU2TTREFMLYQ2O");
    //const traderKeypair = Keypair.fromSecret("SCZ5UDK4ZIMSFZPJ5FKEA7LSIGN6V4DUHV4OPFMG5JP6G2VJGC5M5TMQ");

    const traderKeyPair=await this.profileService.getProfileById(userId)
    const traderKeypair=Keypair.fromSecret(traderKeyPair.secretKey)

    const sellingAsset = sellingAssetCode === 'native'
      ? Asset.native()
      : new Asset(sellingAssetCode, issuingKeypair.publicKey());
    const buyingAsset = buyingAssetCode === 'native'
      ? Asset.native()
      : new Asset(buyingAssetCode, issuingKeypair.publicKey());

    try {
      const traderAccount = await this.server.loadAccount(traderKeypair.publicKey());
      const transaction = new TransactionBuilder(traderAccount, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(Operation.manageSellOffer({
          selling: sellingAsset,
          buying: buyingAsset,
          amount: amount,
          price: price,
        }))
        .setTimeout(30)
        .build();
      transaction.sign(traderKeypair);
      const result = await this.server.submitTransaction(transaction);
      return result;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        this.logger.error('Failed to create offer', error.response.data);
      } else {
        this.logger.error('Failed to create offer', error.message);
      }
      throw error;
    }
  }

  async getOrderBook(sellingAssetCode: string, issuingAccountSecret: string) {
    const issuingKeypair = Keypair.fromSecret(issuingAccountSecret);
    const sellingAsset = new Asset(sellingAssetCode, issuingKeypair.publicKey());
    const buyingAsset = Asset.native();

    try {
      const orderbook = await this.server.orderbook(sellingAsset, buyingAsset).call();
      return {
        bids: orderbook.bids,
        asks: orderbook.asks,
      };
    } catch (error) {
      this.logger.error('Error fetching order book', error);
      throw error;
    }
  }

  // async getAllAssets() {
  //   try {
  //     const assets = await this.server.assets().call();
  //     return assets.records
  //   } catch (error) {
  //     console.error('Error fetching all assets:', error);
  //     return null;
  //   }
  // }

  // async getAssetsByCode(assetCodes: string[]) {
  //   try {
  //     const assets = await this.server.assets().call();
  //     console.log(assets)
  //     return assets.records.filter(asset => assetCodes.includes(asset.asset_code));
  //   } catch (error) {
  //     console.error('Error fetching assets:', error);
  //     return null;
  //   }
  // }

}
