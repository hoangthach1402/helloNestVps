import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { BillsService } from './bills.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';

/**
 * Controller for managing bills
 * No authorization required as per user request
 */
@Controller('owners/:ownerId/tours/:tourId/bills')
export class BillsController {
  constructor(private readonly billsService: BillsService) {}

  /**
   * Create a new bill for a specific tour
   * POST /owners/:ownerId/tours/:tourId/bills
   */
  @Post()
  create(
    @Param('ownerId', ParseIntPipe) ownerId: number,
    @Param('tourId', ParseIntPipe) tourId: number,
    @Body() createBillDto: CreateBillDto,
  ) {
    return this.billsService.create(tourId, ownerId, createBillDto);
  }

  /**
   * Get all bills for a specific tour
   * GET /owners/:ownerId/tours/:tourId/bills
   * Optional query parameter: category
   */
  @Get()
  findAll(
    @Param('ownerId', ParseIntPipe) ownerId: number,
    @Param('tourId', ParseIntPipe) tourId: number,
    @Query('category') category?: string,
  ) {
    if (category) {
      return this.billsService.findByCategory(tourId, ownerId, category);
    }
    return this.billsService.findAllByTour(tourId, ownerId);
  }

  /**
   * Get total expenses for a tour
   * GET /owners/:ownerId/tours/:tourId/bills/total
   */
  @Get('total')
  getTotalExpenses(
    @Param('ownerId', ParseIntPipe) ownerId: number,
    @Param('tourId', ParseIntPipe) tourId: number,
  ) {
    return this.billsService.getTotalExpenses(tourId, ownerId);
  }

  /**
   * Get a specific bill
   * GET /owners/:ownerId/tours/:tourId/bills/:id
   */
  @Get(':id')
  findOne(
    @Param('ownerId', ParseIntPipe) ownerId: number,
    @Param('tourId', ParseIntPipe) tourId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.billsService.findOne(id, tourId, ownerId);
  }

  /**
   * Update a bill
   * PATCH /owners/:ownerId/tours/:tourId/bills/:id
   */
  @Patch(':id')
  update(
    @Param('ownerId', ParseIntPipe) ownerId: number,
    @Param('tourId', ParseIntPipe) tourId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBillDto: UpdateBillDto,
  ) {
    return this.billsService.update(id, tourId, ownerId, updateBillDto);
  }

  /**
   * Delete a bill
   * DELETE /owners/:ownerId/tours/:tourId/bills/:id
   */
  @Delete(':id')
  remove(
    @Param('ownerId', ParseIntPipe) ownerId: number,
    @Param('tourId', ParseIntPipe) tourId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.billsService.remove(id, tourId, ownerId);
  }
}