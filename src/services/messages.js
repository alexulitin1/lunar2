import { query } from '../db/index.js';

export async function saveMessage(userId, role, content) {
  const sql = `
    INSERT INTO user_messages (user_id, role, content, content_vector)
    VALUES ($1, $2, $3, to_jsonb($3))
    RETURNING id
  `;
  
  return query(sql, [userId, role, content]);
}

export async function getRecentMessages(userId, limit = 12) {
  const sql = `
    SELECT role, content
    FROM user_messages
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT $2
  `;
  
  const result = await query(sql, [userId, limit]);
  return result.rows.reverse();
}

export async function summarizeOldMessages(userId) {
  // Get oldest 40 messages
  const oldMessages = await query(`
    SELECT role, content
    FROM user_messages
    WHERE user_id = $1
    ORDER BY created_at ASC
    LIMIT 40
  `, [userId]);

  // Generate summary using GroqCloud
  const summary = await callGroqCloud([
    { role: 'system', content: 'Summarize the following conversation:' },
    ...oldMessages.rows
  ]);

  // Begin transaction
  const client = await getClient();
  try {
    await client.query('BEGIN');

    // Delete old messages
    await client.query(`
      DELETE FROM user_messages
      WHERE id IN (
        SELECT id FROM user_messages
        WHERE user_id = $1
        ORDER BY created_at ASC
        LIMIT 40
      )
    `, [userId]);

    // Insert summary
    await client.query(`
      INSERT INTO user_messages (user_id, role, content, content_vector)
      VALUES ($1, 'assistant', $2, to_jsonb($2))
    `, [userId, summary]);

    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}