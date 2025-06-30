import { IsString, IsOptional, IsEmail, IsUrl } from 'class-validator';

/**
 * DTO for creating a new member
 */
export class CreateMemberDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsUrl()
  avatar?: string;
}