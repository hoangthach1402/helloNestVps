import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ 
    example: 'john_doe', 
    description: 'Username for the user' 
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ 
    example: 'john@example.com', 
    description: 'Email address of the user' 
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    example: 'password123', 
    description: 'Password (minimum 6 characters)',
    minLength: 6 
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ 
    example: 'John', 
    description: 'First name of the user',
    required: false 
  })
  @IsString()
  firstName?: string;

  @ApiProperty({ 
    example: 'Doe', 
    description: 'Last name of the user',
    required: false 
  })
  @IsString()
  lastName?: string;
}

export class LoginDto {
  @ApiProperty({ 
    example: 'john_doe', 
    description: 'Username' 
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ 
    example: 'password123', 
    description: 'Password' 
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
