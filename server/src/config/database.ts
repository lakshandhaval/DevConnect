import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from './env';
import { User } from '../entities/User';
import { Skill } from '../entities/Skill';
import { Job } from '../entities/Job';
import { Application } from '../entities/Application';
import { SavedJob } from '../entities/SavedJob';

export const AppDataSource = new DataSource({
  type: 'postgres',
  ...(env.DATABASE_URL
    ? { url: env.DATABASE_URL }
    : {
        host: env.DB_HOST,
        port: env.DB_PORT,
        username: env.DB_USER,
        password: env.DB_PASSWORD,
        database: env.DB_NAME,
      }),
  ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  synchronize: env.NODE_ENV === 'development',
  logging: env.NODE_ENV === 'development',
  entities: [User, Skill, Job, Application, SavedJob],
  migrations: [],
  subscribers: [],
});
