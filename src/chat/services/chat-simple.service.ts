import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from '../entities/chat.entity';
import { GeminiService } from './gemini.service';
import { AskDto, ChatResponseDto } from '../dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    private geminiService: GeminiService
  ) {}
  async ask(askDto: AskDto): Promise<ChatResponseDto> {
    // Tự động tạo sessionId nếu không có
    const sessionId = askDto.sessionId || `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // 1. Lưu câu hỏi của user
    await this.saveMessage(sessionId, askDto.message, 'user');

    // 2. Lấy lịch sử 5 tin nhắn gần nhất
    const history = await this.getHistory(sessionId, 5);
    const historyText = history
      .map(h => `${h.role}: ${h.message}`)
      .join('\n');

    // 3. Hỏi AI
    const aiResponse = await this.geminiService.askSQL(askDto.message, historyText);

    // 4. Lưu phản hồi AI
    const aiChat = await this.saveMessage(
      sessionId, 
      aiResponse.answer, 
      'assistant',
      aiResponse.sqlQuery,
      aiResponse.data
    );    return {
      id: aiChat.id,
      sessionId: sessionId,
      message: aiResponse.answer,
      sqlQuery: aiResponse.sqlQuery,
      data: aiResponse.data,
      timestamp: aiChat.createdAt
    };
  }

  private async saveMessage(
    sessionId: string, 
    message: string, 
    role: string,
    sqlQuery?: string,
    data?: any
  ): Promise<Chat> {
    const chat = this.chatRepository.create({
      sessionId,
      message,
      role,
      sqlQuery,
      data
    });
    return this.chatRepository.save(chat);
  }

  async getHistory(sessionId: string, limit: number = 10): Promise<Chat[]> {
    return this.chatRepository.find({
      where: { sessionId },
      order: { createdAt: 'DESC' },
      take: limit
    });
  }

  async clearHistory(sessionId: string): Promise<void> {
    await this.chatRepository.delete({ sessionId });
  }
}
