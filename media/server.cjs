require('dotenv').config(); // .env を読む
console.log('BOOT FILE:', __filename);
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const fs = require('fs');

// Load .env (support both repo root and media folder)
try {
  const dotenv = require('dotenv');
  const candidates = [
    path.resolve(__dirname, '.env'),
    path.resolve(__dirname, '..', '.env'),
  ];
  for (const p of candidates) {
    dotenv.config({ path: p });
  }
} catch (e) {
  // dotenv not installed; ignore and rely on process.env
}

const app = express();
// Trust the first proxy (for Render/Express rate limit correctness)
app.set('trust proxy', 1);
// Global request logger for debugging
app.use((req, _res, next) => { try { console.log('REQ', req.method, req.originalUrl); } catch (_) {} next(); });
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

// Admin token (env overrideable)
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'dev-admin';

// CORS（APP_ORIGINS で制御、未設定なら localhost を許可）
const defaults = ['http://localhost:3001', 'http://localhost:5173'];
const allowed = (process.env.APP_ORIGINS
  ? process.env.APP_ORIGINS.split(',').map((s) => s.trim()).filter(Boolean)
  : defaults);
app.use(
  cors({
    origin(origin, cb) {
      if (!origin || allowed.includes(origin)) return cb(null, true);
      return cb(new Error('CORS'));
    },
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
console.log('CORS allowed origins:', allowed);
app.use(express.json());

// Proxy CMS UI/API under /cms -> https://ai-news-cms.onrender.com
app.use(
  '/cms',
  createProxyMiddleware({
    target: 'https://ai-news-cms.onrender.com',
    changeOrigin: true,
    pathRewrite: { '^/cms': '/' },
  })
);

// Early debug endpoints before static
app.get('/ping', (req, res) => res.json({ ok: true, at: Date.now() }));
app.get('/__routes', (req, res) => {
  const r = {
    has_router: !!app._router,
    keys: Object.keys(app._router || {}),
    stack_len: (app._router?.stack?.length ?? 0),
    layers: (app._router?.stack || app._router?.layers || []).map((s) => ({
      name: s.name,
      path: s.route?.path || s.regexp?.toString() || null,
      methods: s.route?.methods || null,
      keys: s.keys || null,
    })),
  };
  res.json(r);
});

// Serve static files from ./public and health check endpoint
app.use(express.static(path.join(__dirname, 'public')));
app.get('/healthz', (_, res) => res.json({ ok: true }));

// Configure Postgres pool (TLS for Render)
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL is not set');
  process.exit(1);
}

// SSL config via env: SSL_MODE and optional SSL_CA/SSL_CA_PATH
const mode = process.env.SSL_MODE || 'strict';
const caInline = process.env.SSL_CA; // PEM string
const caPath = process.env.SSL_CA_PATH; // file path
let ssl = undefined;
let caSource = 'none';
if (mode === 'no-verify') {
  // Explicitly disable certificate verification
  ssl = { rejectUnauthorized: false };
  caSource = 'none';
} else if (caInline && caInline.trim()) {
  // Inline PEM takes precedence
  ssl = { ca: caInline };
  caSource = 'inline';
} else if (caPath && caPath.trim()) {
  // Use provided CA bundle path
  try {
    const ca = fs.readFileSync(caPath, 'utf8');
    ssl = { ca };
    caSource = 'path';
  } catch (e) {
    console.warn('WARN: Failed to read SSL_CA_PATH:', e.message);
    // Fallback to default CA store
    ssl = true;
    caSource = 'none';
  }
} else {
  // Default: use system CA store (do not pass empty object)
  ssl = true;
  caSource = 'none';
}
console.log('SSL mode:', mode, 'caSource:', caSource);

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl,
});

// 認証ユーティリティ: timingSafeEqual + トークン抽出
function safeEqual(a, b) {
  const A = Buffer.from(a || '');
  const B = Buffer.from(b || '');
  if (A.length !== B.length) return false;
  return crypto.timingSafeEqual(A, B);
}
function getToken(req) {
  const h = req.get('authorization') || '';
  return h.startsWith('Bearer ') ? h.slice(7) : '';
}

// Startup DB connectivity check
async function start() {
  try {
    await pool.query('select 1');
    console.log('DB connected');
  } catch (err) {
    console.warn('WARN: Initial DB check failed:', err.message);
    // Do not exit; continue running so app can start and be retried.
  }

  // Debug route (register first)
  app.get('/__routes', (req, res) => {
    const list = [];
    (app._router?.stack || []).forEach((s) => {
      if (s.route?.path) list.push({ path: s.route.path, methods: Object.keys(s.route.methods) });
    });
    res.json(list);
  });
  console.log('REGISTERED: GET /__routes');

  // GET /api/articles -> list with pagination
  app.get('/api/articles', async (req, res) => {
    console.log('HANDLER HIT:', req.method, req.originalUrl);
    try {
      const limit = Math.min(50, Math.max(1, parseInt(req.query.limit || '20', 10) || 20));
      const offset = Math.max(0, parseInt(req.query.offset || '0', 10) || 0);
      const { rows } = await pool.query(
        `select id, slug, title, excerpt, author, body, created_at, published
         from articles where published = true
         order by created_at desc limit $1 offset $2`,
        [limit, offset]
      );
      return res.json(rows);
    } catch (err) {
      console.error('GET /api/articles failed:', err.message);
      return res.status(500).json({ error: err.message });
    }
  });
  console.log('REGISTERED: GET /api/articles');

  // GET /api/articles/:id -> single article
  app.get('/api/articles/:id', async (req, res) => {
    console.log('HANDLER HIT:', req.method, req.originalUrl);
    try {
      const { rows } = await pool.query(
        `select id, slug, title, excerpt, author, body, created_at, published
         from articles where id = $1`,
        [req.params.id]
      );
      if (!rows[0]) return res.status(404).json({ error: 'not_found' });
      return res.json(rows[0]);
    } catch (err) {
      console.error('GET /api/articles/:id failed:', err.message);
      return res.status(500).json({ error: 'internal_error' });
    }
  });
  console.log('REGISTERED: GET /api/articles/:id');

  // Rate limit (POST only)
  const postLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 50 });

  // POST /api/articles -> insert to DB (admin only)
  app.post('/api/articles', postLimiter, async (req, res) => {
    console.log('HANDLER HIT:', req.method, req.originalUrl);
    try {
      const token = getToken(req);
      if (!safeEqual(token, ADMIN_TOKEN)) {
        return res.status(401).json({ error: 'unauthorized' });
      }

      const { title, body, excerpt = '', author = 'AIMA', slug } = req.body || {};
      if (!title || !body) return res.status(400).json({ error: 'title/body required' });

      const baseSlug = (slug || title)
        .toLowerCase()
        .replace(/[^\w\-]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      let candidate = baseSlug || 'post';
      let n = 2;
      while (true) {
        try {
          const { rows } = await pool.query(
            `insert into articles (title, slug, excerpt, body, author)
             values ($1, $2, $3, $4, $5)
             returning id, slug, title, excerpt, author, body, created_at, published`,
            [title, candidate, excerpt, body, author]
          );
          return res.status(201).json(rows[0]);
        } catch (e) {
          if (e && e.code === '23505') {
            // unique violation on slug -> try next suffix
            candidate = `${baseSlug}-${n++}`;
            continue;
          }
          console.error('POST /api/articles insert failed:', e.message);
          return res.status(500).json({ error: 'internal_error' });
        }
      }
    } catch (err) {
      console.error('POST /api/articles failed:', err.message);
      return res.status(500).json({ error: 'internal_error' });
    }
  });
  console.log('REGISTERED: POST /api/articles');

  // DELETE /api/articles/:id -> remove article (admin only)
  app.delete('/api/articles/:id', async (req, res) => {
    console.log('HANDLER HIT:', req.method, req.originalUrl);
    try {
      const token = getToken(req);
      if (!safeEqual(token, ADMIN_TOKEN)) {
        return res.status(401).json({ error: 'unauthorized' });
      }
      await pool.query('delete from articles where id=$1', [req.params.id]);
      return res.json({ ok: true });
    } catch (err) {
      console.error('DELETE /api/articles/:id failed:', err.message);
      return res.status(500).json({ error: 'internal_error' });
    }
  });
  console.log('REGISTERED: DELETE /api/articles/:id');

  // Dump routes on boot
  console.log(
    'ROUTES ON BOOT:',
    JSON.stringify(
      (app._router?.stack || [])
        .filter((s) => s.route?.path)
        .map((s) => ({ path: s.route.path, methods: Object.keys(s.route.methods) }))
    )
  );
  // console.dir router object for Express v5 structure visibility
  try {
    console.dir(app._router, { depth: 2 });
  } catch (e) {
    console.log('router dir failed:', e && e.message);
  }
  // Detailed stack dump
  console.log(
    'STACK DUMP:',
    (app._router?.stack || []).map((s) => ({
      name: s.name,
      path: s.route?.path,
      methods: s.route?.methods,
      keys: s.keys,
    }))
  );

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`API server listening on port ${PORT}`);
  });
}

start();
