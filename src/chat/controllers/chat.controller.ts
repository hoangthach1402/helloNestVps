import { Controller, Post, Get, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from '../services/chat-simple.service';
import { GeminiService } from '../services/gemini.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AskDto, ChatResponseDto } from '../dto/chat.dto';
import { VocabularyAssistDto } from '../dto/vocabulary-assist.dto';

@ApiTags('AI SQL Chat')
@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly geminiService: GeminiService
  ) {}

  @Post('ask')
  @ApiOperation({ 
    summary: 'Hỏi AI về SQL 🤖',
    description: 'Gửi câu hỏi bằng tiếng Việt, AI sẽ tạo SQL và trả về kết quả'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'AI trả lời thành công',
    type: ChatResponseDto 
  })
  async ask(@Body() askDto: AskDto): Promise<ChatResponseDto> {
    return this.chatService.ask(askDto);
  }

  @Get('history/:sessionId')
  @ApiOperation({ summary: 'Xem lịch sử chat 📝' })
  async getHistory(@Param('sessionId') sessionId: string) {
    return this.chatService.getHistory(sessionId);
  }
  @Delete('history/:sessionId')
  @ApiOperation({ summary: 'Xóa lịch sử chat 🗑️' })
  async clearHistory(@Param('sessionId') sessionId: string) {
    await this.chatService.clearHistory(sessionId);
    return { message: 'Đã xóa lịch sử chat' };
  }  @Post('vocabulary-assist')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Trợ lý học từ vựng 📚',
    description: 'Gemini sẽ giúp bạn học và ôn tập từ vựng thông minh'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Trợ lý từ vựng trả lời thành công'
  })
  async vocabularyAssist(
    @Body() dto: VocabularyAssistDto,
    @Request() req
  ): Promise<any> {
    try {
      console.log('📝 Vocabulary assist request:', dto);
      console.log('👤 User:', req.user);
      
      if (!dto.message) {
        return {
          error: 'Message is required',
          message: 'Vui lòng nhập câu hỏi của bạn'
        };
      }
      
      const userId = req.user.sub; // Lấy userId từ JWT token
      return await this.geminiService.generateVocabularyResponse(dto.message, userId);
    } catch (error) {
      console.error('❌ Vocabulary assist error:', error);
      return {
        error: 'Internal error',
        message: 'Có lỗi xảy ra khi xử lý yêu cầu của bạn',
        details: error.message
      };
    }
  }
}
