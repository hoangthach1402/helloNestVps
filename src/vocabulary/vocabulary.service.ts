import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Vocabulary } from './entities/vocabulary.entity';
import { CreateVocabularyDto, UpdateVocabularyDto, UpdateReviewStatusDto } from './dto/vocabulary.dto';

@Injectable()
export class VocabularyService {
  constructor(
    @InjectRepository(Vocabulary)
    private vocabularyRepo: Repository<Vocabulary>,
  ) {}
  async create(dto: CreateVocabularyDto, userId: number): Promise<Vocabulary> {
    const vocabulary = this.vocabularyRepo.create({
      ...dto,
      userId,
      status: 0,
      reviewCount: 0,
      nextReviewDate: new Date(), // Hôm nay
    });
    return this.vocabularyRepo.save(vocabulary);
  }

  async findAll(
    userId: number, 
    status?: number, 
    category?: string, 
    dueToday?: boolean
  ): Promise<Vocabulary[]> {
    const query = this.vocabularyRepo.createQueryBuilder('vocabulary')
      .where('vocabulary.userId = :userId', { userId });
    
    if (status !== undefined) {
      query.andWhere('vocabulary.status = :status', { status });
    }
    
    if (category) {
      query.andWhere('vocabulary.category = :category', { category });
    }
    
    if (dueToday) {
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      query.andWhere('vocabulary.nextReviewDate <= :today', { today });
    }
    
    return query.orderBy('vocabulary.nextReviewDate', 'ASC').getMany();
  }
  async findOne(id: number): Promise<Vocabulary | null> {
    return this.vocabularyRepo.findOneBy({ id });
  }

  async update(id: number, dto: UpdateVocabularyDto): Promise<Vocabulary | null> {
    await this.vocabularyRepo.update(id, dto);
    return this.vocabularyRepo.findOneBy({ id });
  }

  async updateReviewStatus(id: number, dto: UpdateReviewStatusDto): Promise<Vocabulary | null> {
    const vocabulary = await this.vocabularyRepo.findOneBy({ id });
    
    if (!vocabulary) {
      return null;
    }
    
    vocabulary.status = dto.status;
    vocabulary.reviewCount += 1;
    vocabulary.lastReviewedAt = new Date();
    
    // Tính toán ngày ôn tập tiếp theo dựa trên thuật toán đơn giản
    if (dto.nextReviewDate) {
      vocabulary.nextReviewDate = dto.nextReviewDate;
    } else {
      vocabulary.nextReviewDate = this.calculateNextReviewDate(vocabulary.status, vocabulary.reviewCount);
    }
    
    return this.vocabularyRepo.save(vocabulary);
  }

  async remove(id: number): Promise<void> {
    await this.vocabularyRepo.delete(id);
  }
  
  async getDueToday(userId: number): Promise<Vocabulary[]> {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    return this.vocabularyRepo.find({
      where: {
        userId,
        nextReviewDate: LessThanOrEqual(today)
      },
      order: {
        status: 'ASC',
        nextReviewDate: 'ASC'
      },
      take: 20 // Giới hạn số lượng từ mỗi ngày
    });
  }
  
  // Thuật toán đơn giản: thời gian ôn tập tăng dần theo cấp số nhân
  private calculateNextReviewDate(status: number, reviewCount: number): Date {
    const today = new Date();
    let daysToAdd = 1;
    
    if (status === 0) {
      daysToAdd = 1; // Từ mới: 1 ngày
    } else if (status === 1) {
      daysToAdd = 3; // Đang học: 3 ngày
    } else if (status === 2) {
      // Đang ôn tập: 7, 14, 30, 60, 90 ngày tùy theo số lần đã ôn tập
      if (reviewCount <= 1) daysToAdd = 7;
      else if (reviewCount <= 2) daysToAdd = 14;
      else if (reviewCount <= 3) daysToAdd = 30;
      else if (reviewCount <= 4) daysToAdd = 60;
      else daysToAdd = 90;
    } else {
      // Đã thuộc: 180 ngày
      daysToAdd = 180;
    }
    
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysToAdd);
    return nextDate;
  }
}
