import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, ManyToMany, JoinTable, OneToMany
} from 'typeorm';
import { Skill } from './Skill';
import { Application } from './Application';
import { SavedJob } from './SavedJob';
import { Job } from './Job';

export type UserRole = 'user' | 'admin';
export type ExperienceLevel = 'junior' | 'mid' | 'senior' | 'lead';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ type: 'enum', enum: ['user', 'admin'], default: 'user' })
  role: UserRole;

  @Column({ nullable: true, type: 'text' })
  bio: string | null;

  @Column({ nullable: true, type: 'varchar', length: 100 })
  location: string | null;

  @Column({ nullable: true, type: 'varchar', length: 500 })
  resumeUrl: string | null;

  @Column({
    nullable: true,
    type: 'enum',
    enum: ['junior', 'mid', 'senior', 'lead'],
  })
  experienceLevel: ExperienceLevel | null;

  @ManyToMany(() => Skill, (skill) => skill.users, { eager: true })
  @JoinTable({
    name: 'user_skills',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'skillId', referencedColumnName: 'id' },
  })
  skills: Skill[];

  @OneToMany(() => Application, (app) => app.user)
  applications: Application[];

  @OneToMany(() => SavedJob, (saved) => saved.user)
  savedJobs: SavedJob[];

  @OneToMany(() => Job, (job) => job.postedBy)
  postedJobs: Job[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
