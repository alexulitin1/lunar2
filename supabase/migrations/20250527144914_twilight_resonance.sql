/*
  # Add missing policies and indexes

  This migration ensures all necessary policies and indexes exist without recreating existing tables.

  1. Security
    - Adds any missing RLS policies for all tables
    - Ensures proper access control for users

  2. Performance
    - Adds any missing indexes for better query performance
*/

-- Add any missing policies using safe DO blocks
DO $$ 
BEGIN
  -- Users table policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can read own data'
  ) THEN
    CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Users can update own data'
  ) THEN
    CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);
  END IF;

  -- Completed days policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'completed_days' AND policyname = 'Users can read own completed days'
  ) THEN
    CREATE POLICY "Users can read own completed days" ON completed_days FOR SELECT USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'completed_days' AND policyname = 'Users can insert own completed days'
  ) THEN
    CREATE POLICY "Users can insert own completed days" ON completed_days FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Daily goals policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'daily_goals' AND policyname = 'Users can read own goals'
  ) THEN
    CREATE POLICY "Users can read own goals" ON daily_goals FOR SELECT USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'daily_goals' AND policyname = 'Users can insert own goals'
  ) THEN
    CREATE POLICY "Users can insert own goals" ON daily_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'daily_goals' AND policyname = 'Users can update own goals'
  ) THEN
    CREATE POLICY "Users can update own goals" ON daily_goals FOR UPDATE USING (auth.uid() = user_id);
  END IF;

  -- Chat history policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'chat_history' AND policyname = 'Users can read own chat history'
  ) THEN
    CREATE POLICY "Users can read own chat history" ON chat_history FOR SELECT USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'chat_history' AND policyname = 'Users can insert own chat messages'
  ) THEN
    CREATE POLICY "Users can insert own chat messages" ON chat_history FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Add any missing indexes
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE tablename = 'completed_days' AND indexname = 'idx_completed_days_user_date'
  ) THEN
    CREATE INDEX idx_completed_days_user_date ON completed_days(user_id, date);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE tablename = 'daily_goals' AND indexname = 'idx_daily_goals_user_date'
  ) THEN
    CREATE INDEX idx_daily_goals_user_date ON daily_goals(user_id, date);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE tablename = 'chat_history' AND indexname = 'idx_chat_history_user_date'
  ) THEN
    CREATE INDEX idx_chat_history_user_date ON chat_history(user_id, date);
  END IF;
END $$;