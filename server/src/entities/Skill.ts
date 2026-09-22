import {
  Entity, PrimaryGeneratedColumn, Column, ManyToMany, CreateDateColumn
} from 'typeorm';
import { User } from './User';
import { Job } from './Job';

@Entity('skills')
export class Skill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 100 })
  name: string;

  @ManyToMany(() => User, (user) => user.skills)
  users: User[];

  @ManyToMany(() => Job, (job) => job.skills)
  jobs: Job[];

  @CreateDateColumn()
  createdAt: Date;
}
