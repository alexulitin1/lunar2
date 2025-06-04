import pg from 'pg';
const { Pool } = pg;

let pool;

export async function initializeDatabase() {
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL not set. Database features will be disabled.');
    return;
  }

  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  // Test connection
  try {
    const client = await pool.connect();
    console.log('Connected to PostgreSQL database');
    client.release();
  } catch (err) {
    console.error('Database connection error:', err);
    console.warn('Continuing without database connection. Some features may be limited.');
  }
}

export async function query(text, params) {
  if (!pool) {
    throw new Error('Database not initialized');
  }
  return pool.query(text, params);
}

export async function getClient() {
  if (!pool) {
    throw new Error('Database not initialized');
  }
  return pool.connect();
}