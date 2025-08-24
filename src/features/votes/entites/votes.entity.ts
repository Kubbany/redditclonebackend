import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
} from 'typeorm';

@Entity('votes')
@Unique(['userId', 'postId'])
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  postId: number;

  @Column()
  value: number;

  @CreateDateColumn()
  createdAt: Date;
}
