import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Bill } from '../bills/bill.entity';

/**
 * Tour entity represents a travel tour
 * Each tour belongs to an owner (User) and can have multiple bills
 */
@Entity('tours')
export class Tour {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column('text', { array: true, default: '{}' })
  images: string[]; // Array of image URLs

  @Column('int', { array: true, default: '{}' })
  memberIds: number[]; // Array of member IDs participating in this tour

  // Foreign key to User (owner)
  @Column()
  ownerId: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @OneToMany(() => Bill, bill => bill.tour)
  bills: Bill[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}