//app.mjs
//we are in ES6, use this.
import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFile } from 'fs/promises';
import { MongoClient, ServerApiVersion } from 'mongodb';

// ── Path helpers (needed because __dirname doesn't exist in ES modules) ──
const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

// ── Environment ──
const PORT    = process.env.PORT    || 3000;
const uri     = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME || 'devdb';

const myVar = 'injected from server'; // server-side variable for template demo

// ── MongoDB client (created once, stays open) ──
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db = null; // populated after connect(); available to CRUD routes later

async function connectDB() {
  try {
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    db = client.db(DB_NAME);
    console.log(`✅  MongoDB connected  →  db: ${DB_NAME}`);
  } catch (err) {
    console.warn('⚠️   MongoDB unavailable — running without database:', err.message);
    db = null;
  }
}

// ── Express app ──
const app = express();

// ── Middleware ──
app.use(express.static(join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger — prints method, path, status, and response time
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const ms     = Date.now() - start;
    const status = res.statusCode;
    const color  = status >= 500 ? '31' : status >= 400 ? '33' : status >= 300 ? '36' : '32';
    console.log(`\x1b[${color}m${req.method}\x1b[0m ${req.originalUrl} → ${status} (${ms}ms)`);
  });
  next();
});

// ── Health endpoint — useful for Render / GCP health checks ──
app.get('/health', (req, res) => {
  res.json({
    status : 'ok',
    uptime : Math.floor(process.uptime()) + 's',
    db     : db ? 'connected' : 'disconnected',
  });
});

// ── Status endpoint — dev info at a glance ──
app.get('/api/status', (_req, res) => {
  res.json({
    node    : process.version,
    env     : process.env.NODE_ENV || 'development',
    db      : db ? 'connected' : 'disconnected',
    dbName  : db ? DB_NAME : null,
    uptime  : Math.floor(process.uptime()) + 's',
    memory  : Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
  });
});

// ── Demo routes (professor starter code — unchanged) ──
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

app.get('/inject', (req, res) => {
  readFile(join(__dirname, 'public', 'index.html'), 'utf8')
    .then(html => {
      const injectedHtml = html.replace('{{myVar}}', myVar);
      res.send(injectedHtml);
    })
    .catch(() => res.status(500).send('Error loading page'));
});

app.get('/api/json', (req, res) => {
  const myVar = 'Hello from server!';
  res.json({ myVar });
});

app.get('/api/query', (req, res) => {
  console.log('client request with query param:', req.query.name);
  res.json({ message: req.query.name });
});

app.get('/api/url/:iaddasfsd', (req, res) => {
  console.log('client request with URL param:', req.params.iaddasfsd);
  res.json({ message: `Hi, ${req.params.iaddasfsd}. How are you?` });
});

app.post('/api/body', (req, res) => {
  console.log('client request with body:', req.body.name);
  res.json({ message: req.body.name });
});

// ── CRUD routes go here ──
// Example: app.get('/api/items', async (req, res) => { ... })
// Use `db` to access the MongoDB database once connected.

// ── 404 handler — catches any unmatched route ──
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// ── 500 error handler — catches anything thrown in a route ──
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

// ── Boot sequence — connect DB then start listening ──
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`  🚀  Server running on http://localhost:${PORT}`);
    console.log(`  🗄️   Database : ${db ? DB_NAME : 'none (in-memory only)'}`);
    console.log(`  🌱  Node     : ${process.version}`);
    console.log(`  🔧  ENV      : ${process.env.NODE_ENV || 'development'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
  });
});
