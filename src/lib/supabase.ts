import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export async function initializeUser(telegramId: string) {
  const { data: user, error } = await supabase
    .from('users')
    .select()
    .eq('telegram_id', telegramId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error checking user:', error);
    return null;
  }

  if (!user) {
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert([{ telegram_id: telegramId }])
      .select()
      .single();

    if (createError) {
      console.error('Error creating user:', createError);
      return null;
    }

    return newUser;
  }

  return user;
}

export async function updateUserLastActive(userId: string) {
  const { error } = await supabase
    .from('users')
    .update({ last_active: new Date().toISOString() })
    .eq('id', userId);

  if (error) {
    console.error('Error updating last active:', error);
  }
}

export async function getCompletedDays(userId: string) {
  const { data, error } = await supabase
    .from('completed_days')
    .select('date')
    .eq('user_id', userId)
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching completed days:', error);
    return [];
  }

  return data.map(d => d.date);
}

export async function markDayComplete(userId: string, date: string) {
  const { error } = await supabase
    .from('completed_days')
    .insert([{ user_id: userId, date }]);

  if (error && error.code !== '23505') { // Ignore unique constraint violations
    console.error('Error marking day complete:', error);
    return false;
  }

  return true;
}

export async function getDailyGoals(userId: string, date: string) {
  const { data, error } = await supabase
    .from('daily_goals')
    .select()
    .eq('user_id', userId)
    .eq('date', date)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching daily goals:', error);
    return [];
  }

  return data;
}

export async function saveDailyGoals(userId: string, date: string, goals: Array<{ text: string; completed: boolean; note?: string }>) {
  const { error } = await supabase
    .from('daily_goals')
    .insert(
      goals.map(goal => ({
        user_id: userId,
        date,
        text: goal.text,
        completed: goal.completed,
        note: goal.note
      }))
    );

  if (error) {
    console.error('Error saving daily goals:', error);
    return false;
  }

  return true;
}

export async function updateDailyGoal(goalId: string, updates: { completed?: boolean; note?: string }) {
  const { error } = await supabase
    .from('daily_goals')
    .update(updates)
    .eq('id', goalId);

  if (error) {
    console.error('Error updating daily goal:', error);
    return false;
  }

  return true;
}

export async function saveChatMessage(userId: string, date: string, message: string, isAi: boolean) {
  const { error } = await supabase
    .from('chat_history')
    .insert([{
      user_id: userId,
      date,
      message,
      is_ai: isAi
    }]);

  if (error) {
    console.error('Error saving chat message:', error);
    return false;
  }

  return true;
}

export async function getChatHistory(userId: string, date: string) {
  const { data, error } = await supabase
    .from('chat_history')
    .select()
    .eq('user_id', userId)
    .eq('date', date)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching chat history:', error);
    return [];
  }

  return data;
}