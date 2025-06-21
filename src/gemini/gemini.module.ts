import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeminiController } from './gemini.controller';
import { GeminiService } from './gemini.service';
import { User } from '../users/user.entity';
import { Role } from '../roles/role.entity';

/**
 * Gemini AI Module
 * Provides natural language query capabilities for user data
 * Integrates Google's Gemini AI to convert natural language to SQL
 */
@Module({
  imports: [
    // Import TypeORM repositories for User and Role entities
    TypeOrmModule.forFeature([User, Role])
  ],
  controllers: [GeminiController],
  providers: [GeminiService],
  exports: [GeminiService] // Export service for potential use in other modules
})
export class GeminiModule {}