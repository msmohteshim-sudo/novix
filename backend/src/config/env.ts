import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the root .env file if it exists
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
// Also load from local backend/.env if it exists (for overrides)
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  dbUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod'
};
