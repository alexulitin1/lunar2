import { Telegraf } from 'telegraf';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { handleStart } from './handlers/start.js';
import { handleMessage } from './handlers/message.js';
import { initializeDatabase } from './db/index.js';
import Groq from 'groq-sdk';

// Load environment variables
dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQCLOUD_API_KEY,
});

// Initialize bot only if BOT_TOKEN is available
let bot;
if (process.env.BOT_TOKEN) {
  bot = new Telegraf(process.env.BOT_TOKEN);
  
  // Command handlers
  bot.command('start', handleStart);
  
  // Message handlers
  bot.on('text', handleMessage);
}

// Chat API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, goals, userId } = req.body;

    if (!message) {
      return res.status(400).json({ 
        error: 'Bad Request',
        message: 'Message is required' 
      });
    }

    if (!process.env.GROQCLOUD_API_KEY) {
      return res.status(503).json({ 
        error: 'Service Unavailable',
        message: 'Chat service is not configured' 
      });
    }

    // Build context from goals
    const goalsContext = goals?.length 
      ? `Current goals: ${goals.map(g => g.text).join(', ')}.`
      : 'No goals set for today.';

    // Prepare messages for Groq
    const messages = [
      {
        role: 'system',
        content: `You are a supportive AI coach. ${goalsContext} Provide encouraging and constructive responses.`
      },
      {
        role: 'user',
        content: message
      }
    ];

    try {
      // Call Groq API using SDK
      const completion = await groq.chat.completions.create({
        messages,
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        max_tokens: 200,
      });

      const reply = completion.choices[0]?.message?.content || '';
      return res.json({ reply });

    } catch (error) {
      console.error('Groq API error:', error);
      return res.status(500).json({ 
        error: 'Internal Server Error',
        message: 'Failed to get response from Groq'
      });
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'An unexpected error occurred'
    });
  }
});

// Serve static files from the dist directory
app.use(express.static(join(__dirname, '../../dist')));

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../../dist/index.html'));
});

// Start Express server first
const PORT = process.env.PORT || 3001;

// Function to initialize services
const initializeServices = async () => {
  try {
    // Initialize database
    await initializeDatabase();
    console.log('Database initialized successfully');

    // Start bot only if token is available
    if (bot) {
      await bot.launch();
      console.log('Telegram bot started successfully');
      
      // Enable graceful stop after bot is launched
      process.once('SIGINT', () => {
        try {
          bot.stop('SIGINT');
        } catch (error) {
          console.log('Bot already stopped or not running');
        }
      });
      process.once('SIGTERM', () => {
        try {
          bot.stop('SIGTERM');
        } catch (error) {
          console.log('Bot already stopped or not running');
        }
      });
    } else {
      console.log('Telegram bot not started (BOT_TOKEN not provided)');
    }

    return true;
  } catch (error) {
    console.error('Failed to initialize services:', error);
    return false;
  }
};

// Start the server and initialize services
app.listen(PORT, async () => {
  console.log(`Express server running on port ${PORT}`);
  await initializeServices();
});