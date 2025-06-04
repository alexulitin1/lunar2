# CoachGPT Telegram Bot

An AI coaching assistant powered by GroqCloud that helps users with personal development and goal setting.

## Features

- Natural conversation with AI coach
- Message history persistence
- Rate limiting and usage tracking
- Automatic conversation summarization
- PostgreSQL for storage with JSONB and GIN indexing
- Redis-based rate limiting

## Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your credentials
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run database migrations:
   ```bash
   npm run migrate
   ```
5. Start the bot:
   ```bash
   npm start
   ```

## Environment Variables

- `BOT_TOKEN`: Your Telegram bot token
- `GROQCLOUD_API_KEY`: Your GroqCloud API key
- `GROQCLOUD_BASE_URL`: GroqCloud API base URL
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Upstash Redis connection string

## Rate Limits

- 4 replies per user per day
- 200 tokens per LLM call
- 20 requests per minute

## License

MIT