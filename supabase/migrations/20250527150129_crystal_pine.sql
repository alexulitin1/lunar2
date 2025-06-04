/*
  # Initial Schema Setup
  
  1. Tables
    - users
    - completed_days
    - daily_goals
    - chat_history
    
  2. Security
    - Enable RLS on all tables
    - Add policies for CRUD operations
    
  3. Performance
    - Add indexes for frequently accessed columns
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_id text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_active timestamptz DEFAULT now(),
  settings jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can read own data'
  ) THEN
    CREATE POLICY "Users can read own data"
      ON users
      FOR SELECT
      USING (auth.uid() = id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can update own data'
  ) THEN
    CREATE POLICY "Users can update own data"
      ON users
      FOR UPDATE
      USING (auth.uid() = id);
  END IF;
END $$;

-- Completed days table
CREATE TABLE IF NOT EXISTS completed_days (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

ALTER TABLE completed_days ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'completed_days' AND policyname = 'Users can read own completed days'
  ) THEN
    CREATE POLICY "Users can read own completed days"
      ON completed_days
      FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'completed_days' AND policyname = 'Users can insert own completed days'
  ) THEN
    CREATE POLICY "Users can insert own completed days"
      ON completed_days
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Daily goals table
CREATE TABLE IF NOT EXISTS daily_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  date date NOT NULL,
  text text NOT NULL,
  completed boolean DEFAULT false,
  note text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE daily_goals ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'daily_goals' AND policyname = 'Users can read own goals'
  ) THEN
    CREATE POLICY "Users can read own goals"
      ON daily_goals
      FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'daily_goals' AND policyname = 'Users can insert own goals'
  ) THEN
    CREATE POLICY "Users can insert own goals"
      ON daily_goals
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'daily_goals' AND policyname = 'Users can update own goals'
  ) THEN
    CREATE POLICY "Users can update own goals"
      ON daily_goals
      FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Chat history table
CREATE TABLE IF NOT EXISTS chat_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  date date NOT NULL,
  message text NOT NULL,
  is_ai boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'chat_history' AND policyname = 'Users can read own chat history'
  ) THEN
    CREATE POLICY "Users can read own chat history"
      ON chat_history
      FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'chat_history' AND policyname = 'Users can insert own chat messages'
  ) THEN
    CREATE POLICY "Users can insert own chat messages"
      ON chat_history
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_completed_days_user_date ON completed_days(user_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_goals_user_date ON daily_goals(user_id, date);
CREATE INDEX IF NOT EXISTS idx_chat_history_user_date ON chat_history(user_id, date);