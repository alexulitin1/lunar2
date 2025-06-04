// server.js
import express from 'express';
import dotenv   from 'dotenv';
import Groq     from 'groq-sdk';
import cors     from 'cors';
import path     from 'path';
import { fileURLToPath } from 'url';

// ── env ──────────────────────────────────────────────────────
dotenv.config();

// ── file helpers (ES-module analogue __dirname) ──────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ── app setup ────────────────────────────────────────────────
const app = express();
app.use(cors());
app.use(express.json());

// ── serve React build in production ──────────────────────────
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ── Groq client ──────────────────────────────────────────────
const groq = new Groq({
  apiKey: process.env.GROQCLOUD_API_KEY,   // set in .env
});

// ── chat endpoint ────────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error:   'Bad Request',
        message: 'Message is required',
      });
    }

    const completion = await groq.chat.completions.create({
      model: 'mixtral-8x7b-32768',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user',   content: message },
      ],
      max_tokens: 200,
    });

    const reply = completion.choices[0]?.message?.content || '';
    return res.json({ reply });

  } catch (err) {
    console.error('Chat API error:', err);
    return res.status(500).json({
      error:   'Internal Server Error',
      message: 'An unexpected error occurred',
    });
  }
});

// ── start server ─────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
