import { IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for natural language queries
 * Validates user input for Gemini AI processing
 */
export class QueryDto {
  @ApiProperty({
    description: 'Natural language question about users in Vietnamese or English',
    example: 'Có bao nhiêu người dùng trong hệ thống?',
    minLength: 5,
    maxLength: 500
  })
  @IsString()
  @IsNotEmpty({ message: 'Question cannot be empty' })
  @MinLength(5, { message: 'Question must be at least 5 characters long' })
  @MaxLength(500, { message: 'Question cannot exceed 500 characters' })
  question: string;
}

/**
 * Response DTO for query results
 */
export class QueryResponseDto {
  @ApiProperty({
    description: 'Original question asked by user',
    example: 'Có bao nhiêu người dùng trong hệ thống?'
  })
  question: string;

  @ApiProperty({
    description: 'Generated SQL query',
    example: 'SELECT COUNT(*) as total_users FROM users WHERE isActive = true'
  })
  sqlQuery: string;

  @ApiProperty({
    description: 'Query execution results',
    example: [{ total_users: 25 }]
  })
  results: any[];

  @ApiProperty({
    description: 'Human-readable explanation in Vietnamese',
    example: 'Hiện tại có 25 người dùng đang hoạt động trong hệ thống.'
  })
  explanation: string;
}

/**
 * Schema information response DTO
 */
export class SchemaInfoDto {
  @ApiProperty({
    description: 'Available database tables',
    example: ['users', 'roles']
  })
  tables: string[];

  @ApiProperty({
    description: 'User table fields',
    example: ['id', 'username', 'email', 'firstName', 'lastName', 'isActive', 'createdAt', 'roleId']
  })
  userFields: string[];

  @ApiProperty({
    description: 'Role table fields',
    example: ['id', 'name', 'description']
  })
  roleFields: string[];

  @ApiProperty({
    description: 'Sample questions users can ask',
    example: [
      'Có bao nhiêu người dùng trong hệ thống?',
      'Liệt kê tất cả người dùng có tên là Nguyễn',
      'Người dùng nào được tạo trong tuần này?'
    ]
  })
  sampleQuestions: string[];
}