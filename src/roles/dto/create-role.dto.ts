import { IsString, IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  description?: string;
}
