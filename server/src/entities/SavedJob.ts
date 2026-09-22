import {
  Entity, PrimaryGeneratedColumn, ManyToOne,
  CreateDateColumn, Unique, JoinColumn, Column
} from 'typeorm';
import { User } from './User';
import { Job } from './Job';

@Entity('saved_jobs')
@Unique(['userId', 'jobId'])
export class SavedJob {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.savedJobs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Job, (job) => job.savedByUsers, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'jobId' })
  job: Job;

  @Column()
  jobId: string;

  @CreateDateColumn()
  createdAt: Date;
}
