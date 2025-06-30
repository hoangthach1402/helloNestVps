import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tour } from './tour.entity';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { MembersService } from '../members/members.service';

/**
 * Service for managing tours
 * Handles CRUD operations for tours and validates member assignments
 */
@Injectable()
export class ToursService {
  constructor(
    @InjectRepository(Tour)
    private tourRepository: Repository<Tour>,
    private membersService: MembersService,
  ) {}

  /**
   * Create a new tour for a specific owner
   */
  async create(ownerId: number, createTourDto: CreateTourDto): Promise<Tour> {
    // Validate that all member IDs belong to the owner
    if (createTourDto.memberIds && createTourDto.memberIds.length > 0) {
      const members = await this.membersService.findByIds(createTourDto.memberIds, ownerId);
      if (members.length !== createTourDto.memberIds.length) {
        throw new BadRequestException('Some member IDs are invalid or do not belong to this owner');
      }
    }

    const tour = new Tour();
    Object.assign(tour, {
      ...createTourDto,
      ownerId,
      startDate: createTourDto.startDate ? new Date(createTourDto.startDate) : null,
      endDate: createTourDto.endDate ? new Date(createTourDto.endDate) : null,
    });
    
    return await this.tourRepository.save(tour);
  }

  /**
   * Get all tours for a specific owner
   */
  async findAllByOwner(ownerId: number): Promise<Tour[]> {
    return await this.tourRepository.find({
      where: { ownerId },
      order: { createdAt: 'DESC' },
      relations: ['bills'],
    });
  }

  /**
   * Get a specific tour by ID and owner
   */
  async findOne(id: number, ownerId: number): Promise<Tour> {
    const tour = await this.tourRepository.findOne({
      where: { id, ownerId },
      relations: ['bills'],
    });

    if (!tour) {
      throw new NotFoundException(`Tour with ID ${id} not found`);
    }

    return tour;
  }

  /**
   * Update a tour
   */
  async update(id: number, ownerId: number, updateTourDto: UpdateTourDto): Promise<Tour> {
    const tour = await this.findOne(id, ownerId);
    
    // Validate member IDs if provided
    if (updateTourDto.memberIds && updateTourDto.memberIds.length > 0) {
      const members = await this.membersService.findByIds(updateTourDto.memberIds, ownerId);
      if (members.length !== updateTourDto.memberIds.length) {
        throw new BadRequestException('Some member IDs are invalid or do not belong to this owner');
      }
    }

    Object.assign(tour, {
      ...updateTourDto,
      startDate: updateTourDto.startDate ? new Date(updateTourDto.startDate) : tour.startDate,
      endDate: updateTourDto.endDate ? new Date(updateTourDto.endDate) : tour.endDate,
    });
    
    return await this.tourRepository.save(tour);
  }

  /**
   * Delete a tour
   */
  async remove(id: number, ownerId: number): Promise<void> {
    const tour = await this.findOne(id, ownerId);
    await this.tourRepository.remove(tour);
  }

  /**
   * Get tour summary with expense calculations
   */
  async getTourSummary(id: number, ownerId: number) {
    const tour = await this.findOne(id, ownerId);
    
    if (!tour.bills || tour.bills.length === 0) {
      return {
        tour,
        summary: [],
        totalExpenses: 0,
      };
    }

    // Get member details
    const members = await this.membersService.findByIds(tour.memberIds, ownerId);
    const memberMap = new Map(members.map(m => [m.id, m]));

    // Calculate expenses for each member
    const memberExpenses = new Map<number, { totalPaid: number; totalShare: number }>();

    // Initialize member expenses
    tour.memberIds.forEach(memberId => {
      memberExpenses.set(memberId, { totalPaid: 0, totalShare: 0 });
    });

    // Calculate totals
    tour.bills.forEach(bill => {
      // Add to paid amount
      const paidByExpense = memberExpenses.get(bill.paidBy);
      if (paidByExpense) {
        paidByExpense.totalPaid += Number(bill.amount);
      }

      // Calculate share amount
      const shareAmount = Number(bill.amount) / bill.splitBetween.length;
      bill.splitBetween.forEach(memberId => {
        const memberExpense = memberExpenses.get(memberId);
        if (memberExpense) {
          memberExpense.totalShare += shareAmount;
        }
      });
    });

    // Create summary
    const summary = Array.from(memberExpenses.entries()).map(([memberId, expenses]) => {
      const member = memberMap.get(memberId);
      const balance = expenses.totalPaid - expenses.totalShare;
      
      return {
        member: member || { id: memberId, name: 'Unknown Member' },
        totalPaid: expenses.totalPaid,
        totalShare: expenses.totalShare,
        balance: balance, // Positive means they are owed money, negative means they owe money
      };
    });

    const totalExpenses = tour.bills.reduce((sum, bill) => sum + Number(bill.amount), 0);

    return {
      tour,
      summary,
      totalExpenses,
    };
  }
}