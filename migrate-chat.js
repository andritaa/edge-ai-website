const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function runMigration() {
  try {
    console.log('🔧 Adding conversation_messages table...');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS "conversation_messages" (
        "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "userId" TEXT REFERENCES "user"("id") ON DELETE CASCADE,
        "sessionId" TEXT NOT NULL,
        "role" TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
        "content" TEXT NOT NULL,
        "site" TEXT NOT NULL DEFAULT 'edge-ai',
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`CREATE INDEX IF NOT EXISTS idx_conv_user ON "conversation_messages"("userId");`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_conv_session ON "conversation_messages"("sessionId");`);

    console.log('✅ conversation_messages table ready!');

    const result = await pool.query(`
      SELECT COUNT(*) as count FROM "conversation_messages";
    `);
    console.log(`📋 Current messages in DB: ${result.rows[0].count}`);

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
