/*
  # Reset Database Data
  
  This migration safely removes all data from the tables while preserving the structure
  and relationships.
  
  1. Changes
    - Delete all data from chat_history
    - Delete all data from daily_goals
    - Delete all data from completed_days
    - Delete all data from users
    
  2. Notes
    - Deletes are performed in correct order to respect foreign key constraints
    - No trigger manipulation required
*/

-- Delete data in correct order to respect foreign keys
DELETE FROM chat_history;
DELETE FROM daily_goals;
DELETE FROM completed_days;
DELETE FROM users;