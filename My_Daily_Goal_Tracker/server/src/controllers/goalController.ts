import { Request, Response } from 'express';
import { goalService } from '../services/goalService.js';

export const goalController = {
  create: async (req: Request, res: Response) => {
    try {
      const { text, priority } = req.body;
      
      // Petite validation "middleware" simplifiée ici
      if (!text) {
        return res.status(400).json({ error: "Le texte est obligatoire" });
      }

      const newGoal = await goalService.createGoal(text, priority);
      res.status(201).json(newGoal);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la création" });
    }
  },

  findAll: async (_req: Request, res: Response) => {
    const goals = await goalService.getAllGoals();
    res.json(goals);
  }
};