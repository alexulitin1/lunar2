import { getRecentMessages, saveMessage, summarizeOldMessages } from './messages.js';
import { callGroqCloud } from './groq.js';

export async function processMessage(userId, messageText) {
  // Save user message
  await saveMessage(userId, 'user', messageText);

  // Get recent conversation history
  const messages = await getRecentMessages(userId, 12);

  // Check if we need to summarize old messages
  const totalMessages = messages.length;
  if (totalMessages > 50) {
    await summarizeOldMessages(userId);
  }

  // Get AI response
  const response = await callGroqCloud(messages);

  // Save AI response
  await saveMessage(userId, 'assistant', response);

  return response;
}