import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Tour } from '../tours/tour.entity';

/**
 * Bill entity represents an expense in a tour
 * Each bill belongs to a tour and tracks who paid and who should split the cost
 */
@Entity('bills')
export class Bill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  description: string;

  @Column({ nullable: true })
  category: string; // e.g., 'food', 'transport', 'accommodation', 'entertainment'

  @Column('text', { array: true, default: '{}' })
  images: string[]; // Array of receipt/bill image URLs

  @Column()
  paidBy: number; // Member ID who paid for this bill

  @Column('int', { array: true })
  splitBetween: number[]; // Array of member IDs who should split this bill

  @Column({ nullable: true })
  notes: string;

  // Foreign key to Tour
  @Column()
  tourId: number;

  @ManyToOne(() => Tour, tour => tour.bills, { eager: true })
  @JoinColumn({ name: 'tourId' })
  tour: Tour;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}