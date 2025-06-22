import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class AskDto {
  @ApiProperty({ 
    example: 'Cho tôi xem danh sách tất cả user',
    description: 'Câu hỏi bằng tiếng Việt'
  })
  @IsString()
  message: string;

  @ApiProperty({ 
    example: 'session-123',
    description: 'ID phiên chat (tùy chọn)',
    required: false
  })
  @IsOptional()
  @IsString()
  sessionId?: string;
}

export class ChatResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  sessionId: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  sqlQuery: string;

  @ApiProperty()
  data: any;

  @ApiProperty()
  timestamp: Date;
}
