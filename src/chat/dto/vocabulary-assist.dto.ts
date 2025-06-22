import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class VocabularyAssistDto {
  @ApiProperty({ 
    description: 'Câu hỏi hoặc yêu cầu về từ vựng',
    example: 'Cho tôi xem từ vựng cần học hôm nay'
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}
