import dotenv from 'dotenv';
dotenv.config(); // DOIT ÊTRE ICI

import express from 'express';
import cors from 'cors';
import goalRoutes from './routes/goalRoutes.js';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

//routes avec un préfixe /api/goals
app.use('/api/goals', goalRoutes);

app.get('/', (req, res) => {
  res.send('Le serveur de Goal Tracker est en ligne ! 🚀');
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});