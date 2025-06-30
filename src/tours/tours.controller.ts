import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ToursService } from './tours.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';

/**
 * Controller for managing tours
 * No authorization required as per user request
 */
@Controller('owners/:ownerId/tours')
export class ToursController {
  constructor(private readonly toursService: ToursService) {}

  /**
   * Create a new tour for a specific owner
   * POST /owners/:ownerId/tours
   */
  @Post()
  create(
    @Param('ownerId', ParseIntPipe) ownerId: number,
    @Body() createTourDto: CreateTourDto,
  ) {
    return this.toursService.create(ownerId, createTourDto);
  }

  /**
   * Get all tours for a specific owner
   * GET /owners/:ownerId/tours
   */
  @Get()
  findAll(@Param('ownerId', ParseIntPipe) ownerId: number) {
    return this.toursService.findAllByOwner(ownerId);
  }

  /**
   * Get a specific tour
   * GET /owners/:ownerId/tours/:id
   */
  @Get(':id')
  findOne(
    @Param('ownerId', ParseIntPipe) ownerId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.toursService.findOne(id, ownerId);
  }

  /**
   * Get tour summary with expense calculations
   * GET /owners/:ownerId/tours/:id/summary
   */
  @Get(':id/summary')
  getTourSummary(
    @Param('ownerId', ParseIntPipe) ownerId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.toursService.getTourSummary(id, ownerId);
  }

  /**
   * Update a tour
   * PATCH /owners/:ownerId/tours/:id
   */
  @Patch(':id')
  update(
    @Param('ownerId', ParseIntPipe) ownerId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTourDto: UpdateTourDto,
  ) {
    return this.toursService.update(id, ownerId, updateTourDto);
  }

  /**
   * Delete a tour
   * DELETE /owners/:ownerId/tours/:id
   */
  @Delete(':id')
  remove(
    @Param('ownerId', ParseIntPipe) ownerId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.toursService.remove(id, ownerId);
  }
}