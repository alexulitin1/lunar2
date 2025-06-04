import { query } from './index.js';
import dotenv from 'dotenv';

dotenv.config();

const migrations = [
  // Create user_messages table with JSONB and GIN index
  `
  CREATE TABLE IF NOT EXISTS user_messages (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    content_vector JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
  
  CREATE INDEX IF NOT EXISTS idx_user_messages_user_id ON user_messages(user_id);
  CREATE INDEX IF NOT EXISTS idx_user_messages_content_gin ON user_messages USING GIN (content_vector);
  `,
];

async function runMigrations() {
  try {
    for (const migration of migrations) {
      await query(migration);
    }
    console.log('Migrations completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
}

// Run migrations
runMigrations();