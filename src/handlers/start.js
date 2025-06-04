import { saveMessage } from '../services/messages.js';

export async function handleStart(ctx) {
  const userId = ctx.from.id;
  const welcomeMessage = 'Hello! I am your AI coach. How can I help you today?';
  
  // Save system welcome message
  await saveMessage(userId, 'assistant', welcomeMessage);
  
  // Send welcome message
  await ctx.reply(welcomeMessage);
}