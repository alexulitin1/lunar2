import { processMessage } from '../services/chat.js';
import { checkRateLimit } from '../services/ratelimit.js';

export async function handleMessage(ctx) {
  const userId = ctx.from.id;
  const messageText = ctx.message.text;

  try {
    // Check rate limits
    const canProceed = await checkRateLimit(userId);
    if (!canProceed) {
      await ctx.reply('You have reached your daily message limit. Please try again tomorrow.');
      return;
    }

    // Process message and get AI response
    const response = await processMessage(userId, messageText);
    
    // Send response
    await ctx.reply(response);
  } catch (error) {
    console.error('Error handling message:', error);
    await ctx.reply('Sorry, I encountered an error. Please try again later.');
  }
}