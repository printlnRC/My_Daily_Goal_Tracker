import { Request, Response } from 'express';
import { goalService } from '../services/goalService.js';
import { Prisma } from '@prisma/client';

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
  },

  toggle: async (req, res) => {
    try {
      const { id } = req.params;
      const { completed } = req.body;
      console.log('Toggle request:', { id, completed });
      const updateGoal = await goalService.toggleGoal(Number(id), completed);
      res.json(updateGoal);
    } catch (error) {
      console.error('Error in toggle:', error);
      res.status(500).json({error : "Erreur lors de la mise a jour" });
    }
  }
};