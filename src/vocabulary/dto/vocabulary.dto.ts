import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateVocabularyDto {
  @ApiProperty({ description: 'Từ vựng' })
  @IsString()
  word: string;

  @ApiProperty({ description: 'Nghĩa của từ' })
  @IsString()
  meaning: string;

  @ApiProperty({ description: 'Câu ví dụ', required: false })
  @IsOptional()
  @IsString()
  example?: string;

  @ApiProperty({ description: 'Phân loại (Business, IT, Science, Daily...)', required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ description: 'Cấp độ (Beginner, Intermediate, Advanced)', required: false })
  @IsOptional()
  @IsString()
  level?: string;
}

export class UpdateVocabularyDto {
  @ApiProperty({ description: 'Từ vựng', required: false })
  @IsOptional()
  @IsString()
  word?: string;

  @ApiProperty({ description: 'Nghĩa của từ', required: false })
  @IsOptional()
  @IsString()
  meaning?: string;

  @ApiProperty({ description: 'Câu ví dụ', required: false })
  @IsOptional()
  @IsString()
  example?: string;

  @ApiProperty({ description: 'Phân loại', required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ description: 'Cấp độ', required: false })
  @IsOptional()
  @IsString()
  level?: string;
}

export class UpdateReviewStatusDto {
  @ApiProperty({ description: 'Trạng thái (0: new, 1: learning, 2: reviewing, 3: mastered)' })
  @IsNumber()
  status: number;

  @ApiProperty({ description: 'Đánh giá mức độ nhớ (0-5)', required: false })
  @IsOptional()
  @IsNumber()
  quality?: number;

  @ApiProperty({ description: 'Ngày ôn tập tiếp theo', required: false })
  @IsOptional()
  @IsDateString()
  nextReviewDate?: Date;
}

export class VocabularyResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  word: string;

  @ApiProperty()
  meaning: string;

  @ApiProperty()
  example: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  level: string;

  @ApiProperty()
  status: number;

  @ApiProperty()
  nextReviewDate: Date;

  @ApiProperty()
  reviewCount: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  lastReviewedAt: Date;
}
