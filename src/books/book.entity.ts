import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum BookStatus {
  AVAILABLE = 'available',
  BORROWED = 'borrowed',
}

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'enum', enum: BookStatus, default: BookStatus.AVAILABLE })
  status: BookStatus;

  @Column()
  author: string;

  @Column({ nullable: true })
  publishedYear?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
