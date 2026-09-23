/** 
 * @file goalController.ts
 * @description Contrôleur pour gérer les objectifs (goals) de l'application.
 * Il contient les fonctions pour créer un objectif, récupérer tous les objectifs et basculer le statut d'un objectif.
 * Ces fonctions sont utilisées dans les routes correspondantes pour traiter les requêtes HTTP.
 * @version 1.0
 * @author Sooz (Sam)
 * @date 2026-03-02
 * @license MIT
*/

import { Request, Response } from 'express';
import { goalService } from '../services/goalGet.js';
import type { AuthRequest } from '../Middlewares/auth.js';

export const goalController = {
  create: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId;
      const { text, priority, day } = req.body;

      if (!userId) {
        return res.status(401).json({ error: 'Utilisateur non authentifié.' });
      }

      if (!text) {
        return res.status(400).json({ error: 'Le texte est obligatoire' });
      }

      const newGoal = await goalService.createGoal(text, priority, day, userId);
      res.status(201).json(newGoal);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la création' });
    }
  },

  findAll: async (req: AuthRequest, res: Response) => {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié.' });
    }

    const goals = await goalService.getAllGoals(userId);
    res.json(goals);
  },

  toggle: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId;
      const { id } = req.params;
      const { completed } = req.body;

      if (!userId) {
        return res.status(401).json({ error: 'Utilisateur non authentifié.' });
      }

      console.log('Toggle request:', { id, completed, userId });
      const updateGoal = await goalService.toggleGoal(Number(id), completed, userId);
      res.json(updateGoal);
    } catch (error) {
      console.error('Error in toggle:', error);
      res.status(500).json({ error: 'Erreur lors de la mise a jour' });
    }
  },

  delete: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId;
      const { id } = req.params;

      if (!userId) {
        return res.status(401).json({ error: 'Utilisateur non authentifié.' });
      }

      const deletedGoal = await goalService.deleteGoal(Number(id), userId);
      if (deletedGoal) {
        res.json({ message: 'Objectif supprimé avec succès' });
      } else {
        res.status(404).json({ error: 'Objectif non trouvé' });
      }
    } catch (error) {
      console.error('Error in delete:', error);
      res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
  }
};