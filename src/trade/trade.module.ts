import { Module } from '@nestjs/common';
import { TradeService } from './trade.service';
import { TradeController } from './trade.controller';
import { ProfileService } from 'src/profile/profile.service';
import { TypeOrmModule } from 'src/database/typeorm-ex.module';
import { ProfileRepository } from 'src/profile/profile.repository';

@Module({
  imports:[TypeOrmModule.forCustomRepository([ProfileRepository])],
  controllers: [TradeController],
  providers: [TradeService, ProfileService],
})
export class TradeModule {}
