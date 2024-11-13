import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto'; 
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/user.repository';
import StellarSdk, { Asset, BASE_FEE, Horizon, Keypair, Networks, Operation, TransactionBuilder } from '@stellar/stellar-sdk';
import { ConfigService } from '@nestjs/config';
import { AssetRepository } from './asset.repository';
import { AssetEntity } from './entities/asset.entity';
import * as argon2 from 'argon2';
import { TransactionRepository } from 'src/transaction/transaction.repository';
import { Transaction } from 'src/transaction/entities/transaction.entity';

@Injectable()
export class AssetService {
  private server: Horizon.Server;
  private issuerKeypair: Keypair;

  constructor(@InjectRepository(AssetRepository) private assetRepo:AssetRepository, @InjectRepository(UserRepository) private userRepo: UserRepository, @InjectRepository(TransactionRepository) private transctionRepo: TransactionRepository, private configService: ConfigService){
    this.server = new Horizon.Server('https://horizon-testnet.stellar.org');
 
  }

  async createTrustline(
    assetCode: string,
    recipientPublicKey: string,
    recipientSecretKey: string,
    issuerSecretKey: string // New parameter for dynamic issuer
  ): Promise<AssetEntity> {
    // Step 1: Find and validate the recipient user
    const recipientUser = await this.userRepo.findOne({ where: { publicKey: recipientPublicKey } });
    if (!recipientUser) {
      throw new Error('Recipient user not found');
    }

    const recipientAccount = await this.server.loadAccount(recipientPublicKey);
    const issuerKeypair = Keypair.fromSecret(issuerSecretKey); 
    const asset = new Asset(assetCode, issuerKeypair.publicKey());
  
    const transaction = new TransactionBuilder(recipientAccount, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(Operation.changeTrust({ asset }))
      .setTimeout(30)
      .build();
  
    transaction.sign(Keypair.fromSecret(recipientSecretKey));
    await this.server.submitTransaction(transaction);
  
    const assetRecord = this.assetRepo.create({
      user: recipientUser,
      assetCode: assetCode,
      issuer: issuerKeypair.publicKey(), // Use the dynamic issuer public key here
    });
  
    return await this.assetRepo.save(assetRecord);
  }

  async issueAsset(
    assetCode: string,
    amount: string,
    recipientPublicKey: string,
    issuerPublicKey: string // New parameter to identify the issuer
  ){
    // Step 1: Find the recipient user
    const recipientUser = await this.userRepo.findOne({ where: { publicKey: recipientPublicKey } });
    if (!recipientUser) {
      throw new Error('Recipient user not found');
    }
  
    // Step 2: Retrieve the issuer user and secret key
    const issuerUser = await this.userRepo.findOne({ where: { publicKey: issuerPublicKey } });
    if (!issuerUser || !issuerUser.secretKey) {
      throw new Error('Issuer user not found or missing secret key');
    }
  
    const issuerSecretKey = issuerUser.secretKey; // Assume issuer secret key is stored in plain text for simplicity
  
    // Step 3: Create Keypair for the dynamic issuer
    const issuerKeypair = Keypair.fromSecret(issuerSecretKey);
  
    // Step 4: Load the issuer account from Stellar network
    const issuerAccount = await this.server.loadAccount(issuerKeypair.publicKey());
    const asset = new Asset(assetCode, issuerKeypair.publicKey());
  
    // Step 5: Build and sign the transaction
    const transaction = new TransactionBuilder(issuerAccount, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(Operation.payment({
        destination: recipientUser.publicKey,
        asset: asset,
        amount: amount,
      }))
      .setTimeout(5000)
      .build();
  
    transaction.sign(issuerKeypair); // Sign with dynamic issuer
  
    // Step 6: Submit the transaction
    const result = await this.server.submitTransaction(transaction);
  
    // Step 7: Record the transaction in the database
    const transactionRecord = this.transctionRepo.create({
      recipient: recipientUser,
      assetCode: assetCode,
      amount,
      transactionHash: result.hash,
      issuer: issuerKeypair.publicKey() // Save dynamic issuer's public key
    });
  
    return await this.transctionRepo.save(transactionRecord);
  }
  

  }
  


  

