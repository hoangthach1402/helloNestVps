import { IsNumber, IsString, IsOptional, IsArray, IsInt, IsPositive } from 'class-validator';

/**
 * DTO for creating a new bill
 */
export class CreateBillDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount: number;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsInt()
  paidBy: number; // Member ID

  @IsArray()
  @IsInt({ each: true })
  splitBetween: number[]; // Array of member IDs

  @IsOptional()
  @IsString()
  notes?: string;
}