import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany,
  JoinTable, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn
} from 'typeorm';
import { User } from './User';
import { Skill } from './Skill';
import { Application } from './Application';
import { SavedJob } from './SavedJob';

export type JobType = 'full-time' | 'part-time' | 'remote' | 'contract';

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ length: 200 })
  company: string;

  @Column({ length: 200 })
  location: string;

  @Column({ nullable: true, type: 'int' })
  salaryMin: number | null;

  @Column({ nullable: true, type: 'int' })
  salaryMax: number | null;

  @Column({
    type: 'enum',
    enum: ['full-time', 'part-time', 'remote', 'contract'],
    default: 'full-time',
  })
  jobType: JobType;

  @ManyToOne(() => User, (user) => user.postedJobs, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'postedById' })
  postedBy: User | null;

  @Column({ nullable: true, type: 'uuid' })
  postedById: string | null;

  @ManyToMany(() => Skill, (skill) => skill.jobs, { eager: true })
  @JoinTable({
    name: 'job_skills',
    joinColumn: { name: 'jobId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'skillId', referencedColumnName: 'id' },
  })
  skills: Skill[];

  @OneToMany(() => Application, (app) => app.job)
  applications: Application[];

  @OneToMany(() => SavedJob, (saved) => saved.job)
  savedByUsers: SavedJob[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
