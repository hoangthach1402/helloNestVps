import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bill } from './bill.entity';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { ToursService } from '../tours/tours.service';
import { MembersService } from '../members/members.service';

/**
 * Service for managing bills
 * Handles CRUD operations for bills and validates member assignments
 */
@Injectable()
export class BillsService {
  constructor(
    @InjectRepository(Bill)
    private billRepository: Repository<Bill>,
    private toursService: ToursService,
    private membersService: MembersService,
  ) {}

  /**
   * Create a new bill for a specific tour
   */
  async create(tourId: number, ownerId: number, createBillDto: CreateBillDto): Promise<Bill> {
    // Validate that the tour exists and belongs to the owner
    const tour = await this.toursService.findOne(tourId, ownerId);
    
    // Validate that paidBy member is in the tour
    if (!tour.memberIds.includes(createBillDto.paidBy)) {
      throw new BadRequestException('The member who paid is not part of this tour');
    }

    // Validate that all splitBetween members are in the tour
    const invalidMembers = createBillDto.splitBetween.filter(
      memberId => !tour.memberIds.includes(memberId)
    );
    if (invalidMembers.length > 0) {
      throw new BadRequestException('Some members in splitBetween are not part of this tour');
    }

    // Validate that splitBetween is not empty
    if (createBillDto.splitBetween.length === 0) {
      throw new BadRequestException('splitBetween cannot be empty');
    }

    const bill = this.billRepository.create({
      ...createBillDto,
      tourId,
    });
    
    return await this.billRepository.save(bill);
  }

  /**
   * Get all bills for a specific tour
   */
  async findAllByTour(tourId: number, ownerId: number): Promise<Bill[]> {
    // Validate that the tour exists and belongs to the owner
    await this.toursService.findOne(tourId, ownerId);
    
    return await this.billRepository.find({
      where: { tourId },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get a specific bill by ID
   */
  async findOne(id: number, tourId: number, ownerId: number): Promise<Bill> {
    // Validate that the tour exists and belongs to the owner
    await this.toursService.findOne(tourId, ownerId);
    
    const bill = await this.billRepository.findOne({
      where: { id, tourId },
    });

    if (!bill) {
      throw new NotFoundException(`Bill with ID ${id} not found`);
    }

    return bill;
  }

  /**
   * Update a bill
   */
  async update(id: number, tourId: number, ownerId: number, updateBillDto: UpdateBillDto): Promise<Bill> {
    const bill = await this.findOne(id, tourId, ownerId);
    const tour = await this.toursService.findOne(tourId, ownerId);
    
    // Validate paidBy if provided
    if (updateBillDto.paidBy !== undefined && !tour.memberIds.includes(updateBillDto.paidBy)) {
      throw new BadRequestException('The member who paid is not part of this tour');
    }

    // Validate splitBetween if provided
    if (updateBillDto.splitBetween) {
      if (updateBillDto.splitBetween.length === 0) {
        throw new BadRequestException('splitBetween cannot be empty');
      }
      
      const invalidMembers = updateBillDto.splitBetween.filter(
        memberId => !tour.memberIds.includes(memberId)
      );
      if (invalidMembers.length > 0) {
        throw new BadRequestException('Some members in splitBetween are not part of this tour');
      }
    }

    Object.assign(bill, updateBillDto);
    return await this.billRepository.save(bill);
  }

  /**
   * Delete a bill
   */
  async remove(id: number, tourId: number, ownerId: number): Promise<void> {
    const bill = await this.findOne(id, tourId, ownerId);
    await this.billRepository.remove(bill);
  }

  /**
   * Get bills by category for a tour
   */
  async findByCategory(tourId: number, ownerId: number, category: string): Promise<Bill[]> {
    // Validate that the tour exists and belongs to the owner
    await this.toursService.findOne(tourId, ownerId);
    
    return await this.billRepository.find({
      where: { tourId, category },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get total expenses for a tour
   */
  async getTotalExpenses(tourId: number, ownerId: number): Promise<number> {
    // Validate that the tour exists and belongs to the owner
    await this.toursService.findOne(tourId, ownerId);
    
    const result = await this.billRepository
      .createQueryBuilder('bill')
      .select('SUM(bill.amount)', 'total')
      .where('bill.tourId = :tourId', { tourId })
      .getRawOne();
    
    return Number(result.total) || 0;
  }
}