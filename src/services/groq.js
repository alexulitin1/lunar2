import fetch from 'node-fetch';

const GROQ_MAX_TOKENS = 200;
let lastCallTimestamp = 0;
let remainingTokens = 1000;

export async function callGroqCloud(messages) {
  // Implement rate limiting
  const now = Date.now();
  if (now - lastCallTimestamp < 3000 || remainingTokens < 1000) {
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  try {
    const response = await fetch(`${process.env.GROQCLOUD_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQCLOUD_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages,
        max_tokens: GROQ_MAX_TOKENS,
      }),
    });

    // Update rate limit tracking
    remainingTokens = parseInt(response.headers.get('x-ratelimit-remaining-tokens') || '1000');
    lastCallTimestamp = now;

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('GroqCloud API error:', error);
    throw error;
  }
}