import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/user.entity';

@Entity('vocabularies')
export class Vocabulary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  word: string;

  @Column('text')
  meaning: string;

  @Column({ nullable: true })
  example: string;

  @Column({ nullable: true })
  category: string; // Phân loại: Business, IT, Science, Daily...

  @Column({ nullable: true })
  level: string; // Beginner, Intermediate, Advanced

  @Column({ default: 0 })
  status: number; // 0: new, 1: learning, 2: reviewing, 3: mastered

  @Column({ nullable: true })
  nextReviewDate: Date; // Ngày cần ôn tập tiếp theo

  @Column({ default: 0 })
  reviewCount: number; // Số lần ôn tập

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastReviewedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}
