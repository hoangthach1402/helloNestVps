import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Chat } from './entities/chat.entity';
import { ChatController } from './controllers/chat.controller';
import { ChatService } from './services/chat-simple.service';
import { GeminiService } from './services/gemini.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat]),
    ConfigModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, GeminiService],
  exports: [ChatService, GeminiService],
})
export class ChatModule {}
