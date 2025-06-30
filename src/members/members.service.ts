import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from './member.entity';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

/**
 * Service for managing members
 * Handles CRUD operations for members belonging to specific owners
 */
@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
  ) {}

  /**
   * Create a new member for a specific owner
   */
  async create(ownerId: number, createMemberDto: CreateMemberDto): Promise<Member> {
    const member = this.memberRepository.create({
      ...createMemberDto,
      ownerId,
    });
    return await this.memberRepository.save(member);
  }

  /**
   * Get all members for a specific owner
   */
  async findAllByOwner(ownerId: number): Promise<Member[]> {
    return await this.memberRepository.find({
      where: { ownerId },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get a specific member by ID and owner
   */
  async findOne(id: number, ownerId: number): Promise<Member> {
    const member = await this.memberRepository.findOne({
      where: { id, ownerId },
    });

    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }

    return member;
  }

  /**
   * Update a member
   */
  async update(id: number, ownerId: number, updateMemberDto: UpdateMemberDto): Promise<Member> {
    const member = await this.findOne(id, ownerId);
    
    Object.assign(member, updateMemberDto);
    return await this.memberRepository.save(member);
  }

  /**
   * Delete a member
   */
  async remove(id: number, ownerId: number): Promise<void> {
    const member = await this.findOne(id, ownerId);
    await this.memberRepository.remove(member);
  }

  /**
   * Get members by IDs (for validation in tours)
   */
  async findByIds(ids: number[], ownerId: number): Promise<Member[]> {
    if (ids.length === 0) {
      return [];
    }
    
    return await this.memberRepository
      .createQueryBuilder('member')
      .where('member.id IN (:...ids)', { ids })
      .andWhere('member.ownerId = :ownerId', { ownerId })
      .getMany();
  }
}