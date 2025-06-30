import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { UploadModule } from './upload/upload.module';
import { GeminiModule } from './gemini/gemini.module';
import { ChatModule } from './chat/chat.module';
import { VocabularyModule } from './vocabulary/vocabulary.module';
import { MembersModule } from './members/members.module';
import { ToursModule } from './tours/tours.module';
import { BillsModule } from './bills/bills.module';
import { User } from './users/user.entity';
import { Role } from './roles/role.entity';
import { Chat } from './chat/entities/chat.entity';
import { Vocabulary } from './vocabulary/entities/vocabulary.entity';
import { Member } from './members/member.entity';
import { Tour } from './tours/tour.entity';
import { Bill } from './bills/bill.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      username: process.env.DATABASE_USER || 'nestuser',
      password: process.env.DATABASE_PASSWORD || 'nestpass',
      database: process.env.DATABASE_NAME || 'nestdb',
      entities: [User, Role, Chat, Vocabulary, Member, Tour, Bill],
      synchronize: true, // Bật synchronize để tạo bảng tự động
      logging: process.env.NODE_ENV !== 'production',
    }),    AuthModule,
    UsersModule,
    RolesModule,
    UploadModule,
    GeminiModule,
    ChatModule,
    VocabularyModule,
    MembersModule,
    ToursModule,
    BillsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
