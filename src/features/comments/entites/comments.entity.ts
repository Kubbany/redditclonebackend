import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column()
  authorId: number;

  @Column()
  authorName: string;

  @Column()
  postId: number;

  @CreateDateColumn()
  createdAt: Date;
}
