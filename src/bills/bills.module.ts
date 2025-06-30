import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillsService } from './bills.service';
import { BillsController } from './bills.controller';
import { Bill } from './bill.entity';
import { ToursModule } from '../tours/tours.module';
import { MembersModule } from '../members/members.module';

/**
 * Bills module for managing tour expenses
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Bill]),
    ToursModule, // Import to validate tour ownership
    MembersModule, // Import to validate member IDs
  ],
  controllers: [BillsController],
  providers: [BillsService],
  exports: [BillsService],
})
export class BillsModule {}