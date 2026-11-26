import dotenv from 'dotenv';
dotenv.config(); // DOIT ÊTRE ICI

import express from 'express';
import cors from 'cors';
import goalRoutes from './routes/goal.routes.js';
import authRoutes from './routes/auth.routes.js';
import { getJwtSecret } from './lib/auth.js';
import badgeRoutes from './routes/badge.routes.js';
import { startBadgeScheduler } from './lib/badgeScheduler.js';

const app = express();
const PORT = 5000;
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

try {
  getJwtSecret();
  if (process.env.NODE_ENV === 'production' && !process.env.CLIENT_ORIGIN) {
    throw new Error('CLIENT_ORIGIN must be configured in production.');
  }
  if (process.env.NODE_ENV === 'production' && !clientOrigin.startsWith('https://')) {
    throw new Error('CLIENT_ORIGIN must use HTTPS in production.');
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Invalid server configuration.');
  process.exit(1);
}

app.use(cors({ origin: clientOrigin, credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/badges', badgeRoutes);

app.get('/', (req, res) => {
  res.send('Le serveur de Goal Tracker est en ligne ! 🚀');
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
  startBadgeScheduler();
});