import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToursService } from './tours.service';
import { ToursController } from './tours.controller';
import { Tour } from './tour.entity';
import { MembersModule } from '../members/members.module';

/**
 * Tours module for managing travel tours
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Tour]),
    MembersModule, // Import to validate member IDs
  ],
  controllers: [ToursController],
  providers: [ToursService],
  exports: [ToursService],
})
export class ToursModule {}