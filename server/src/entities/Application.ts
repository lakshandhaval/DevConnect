import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne,
  CreateDateColumn, UpdateDateColumn, Unique, JoinColumn
} from 'typeorm';
import { User } from './User';
import { Job } from './Job';

export type ApplicationStatus =
  | 'applied'
  | 'under_review'
  | 'shortlisted'
  | 'rejected'
  | 'hired';

@Entity('applications')
@Unique(['userId', 'jobId'])
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.applications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Job, (job) => job.applications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'jobId' })
  job: Job;

  @Column()
  jobId: string;

  @Column({
    type: 'enum',
    enum: ['applied', 'under_review', 'shortlisted', 'rejected', 'hired'],
    default: 'applied',
  })
  status: ApplicationStatus;

  @Column({ nullable: true, type: 'text' })
  coverLetter: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
