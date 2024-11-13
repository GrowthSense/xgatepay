import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { ProfileService } from 'src/profile/profile.service';
import { TypeOrmModule } from 'src/database/typeorm-ex.module';
import { ProfileRepository } from 'src/profile/profile.repository';

@Module({
  imports:[TypeOrmModule.forCustomRepository([ProfileRepository])],
  controllers: [TransactionController],
  providers: [TransactionService, ProfileService],
})
export class TransactionModule {}
