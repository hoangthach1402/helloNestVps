import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  sessionId: string; // ID phiên chat

  @Column({ type: 'text' })
  message: string; // Tin nhắn

  @Column({ default: 'user' }) // user hoặc assistant
  role: string;

  @Column({ type: 'text', nullable: true })
  sqlQuery: string; // SQL được tạo ra

  @Column({ type: 'json', nullable: true })
  data: any; // Kết quả

  @CreateDateColumn()
  createdAt: Date;
}
