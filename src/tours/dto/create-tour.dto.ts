import { IsString, IsOptional, IsArray, IsDateString, IsInt } from 'class-validator';

/**
 * DTO for creating a new tour
 */
export class CreateTourDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsArray()
  @IsInt({ each: true })
  memberIds: number[];
}