import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/users/user.entity';
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
  authorId: number;

  @ManyToOne(() => User, (user) => user.books)
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column({ nullable: true })
  publishedYear?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
