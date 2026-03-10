// app.dev.mjs
// Dev-only server — no MongoDB, no persistence.
// Run with: node app.dev.mjs
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();
const PORT = process.env.PORT || 3001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(join(__dirname, 'public')));
app.use(express.json());

// ---------------------------------------------------------------------------
// In-memory store (dev only — resets on server restart)
// ---------------------------------------------------------------------------
const devSaved = [];
let nextId = 1;

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

app.get('/', (_req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', env: 'development', timestamp: new Date().toISOString() });
});

// Mirror the production API shape without touching MongoDB
app.get('/api/dev/workouts', (_req, res) => {
  res.json(devSaved);
});

app.post('/api/dev/workouts', (req, res) => {
  const workout = { _id: String(nextId++), ...req.body, createdAt: new Date().toISOString() };
  devSaved.push(workout);
  res.status(201).json(workout);
});

app.delete('/api/dev/workouts/:id', (req, res) => {
  const idx = devSaved.findIndex(w => w._id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const [removed] = devSaved.splice(idx, 1);
  res.json(removed);
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`[DEV] Server running at http://localhost:${PORT}`);
  console.log('[DEV] No MongoDB connection — using in-memory store.');
});
