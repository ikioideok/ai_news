#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Load .env from media/.env or project .env
try {
  const dotenv = require('dotenv');
  const candidates = [
    path.resolve(__dirname, '..', 'media', '.env'),
    path.resolve(__dirname, '..', '.env'),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) dotenv.config({ path: p });
  }
} catch (e) {}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL is not set.');
  process.exit(1);
}

let sslOption = undefined;
try {
  const { URL } = require('url');
  const u = new URL(connectionString);
  const sslmode = (u.searchParams.get('sslmode') || '').toLowerCase();
  if (sslmode === 'require') sslOption = { rejectUnauthorized: false };
} catch {}

const pool = new Pool({ connectionString, ssl: sslOption });

async function main() {
  const sqlPath = path.resolve(__dirname, '..', 'sql', 'articles.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log('Schema applied via Node pg client.');
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('Failed to apply schema:', e.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();

