import 'reflect-metadata';
import app from './app';
import { AppDataSource } from './config/database';
import { env } from './config/env';
import fs from 'fs';
import path from 'path';

const startServer = async () => {
  try {
    // Ensure uploads directory exists
    const uploadsDir = path.join(__dirname, '..', env.UPLOAD_DIR);
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Initialize database
    await AppDataSource.initialize();
    console.log('✅ Database connected successfully');

    app.listen(env.PORT, () => {
      console.log(`🚀 DevConnect server running on http://localhost:${env.PORT}`);
      console.log(`📖 Health: http://localhost:${env.PORT}/health`);
      console.log(`🌍 Environment: ${env.NODE_ENV}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
