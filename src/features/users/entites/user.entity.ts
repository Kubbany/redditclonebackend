import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}

export default User;
