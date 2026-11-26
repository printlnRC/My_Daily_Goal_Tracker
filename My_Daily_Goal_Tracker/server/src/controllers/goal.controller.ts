/** 
 * @file goal.controller.ts
 * @description Contrôleur pour gérer les objectifs (goals) de l'application.
 * Il contient les fonctions pour créer un objectif, récupérer tous les objectifs et basculer le statut d'un objectif.
 * Ces fonctions sont utilisées dans les routes correspondantes pour traiter les requêtes HTTP.
 * @version 1.0
 * @author Sooz (Sam) et Copilot
 * @date 2026-03-02
 * @license MIT
*/

import { Request, Response } from 'express';
import { GoalNotFoundError, goalService } from '../services/goal.service.js';
import type { AuthRequest } from '../middlewares/auth.middleware.js';

export const goalController = {
  create: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId;
      const { text, priority } = req.body;
      const days = req.body.days ?? (req.body.day ? [req.body.day] : []);
      const validDays = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI', 'DIMANCHE'];
      const validPriorities = ['Sigma', 'Indispensable', 'Cool'];

      if (!userId) {
        return res.status(401).json({ error: 'Utilisateur non authentifié.' });
      }

      if (typeof text !== 'string' || !text.trim()) {
        return res.status(400).json({ error: 'Le texte est obligatoire.' });
      }

      if (!validPriorities.includes(priority)) {
        return res.status(400).json({ error: 'Priorité invalide.' });
      }

      if (!Array.isArray(days) || days.length === 0 || days.some((day: unknown) => typeof day !== 'string' || !validDays.includes(day))) {
        return res.status(400).json({ error: 'Sélectionnez au moins un jour valide.' });
      }

      const newGoals = await goalService.createGoals(
        text.trim(),
        priority,
        [...new Set(days)],
        userId,
      );
      res.status(201).json(newGoals);
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

      if (typeof completed !== 'boolean') {
        return res.status(400).json({ error: 'Le statut completed doit être un booléen.' });
      }

      const updateGoal = await goalService.toggleGoal(Number(id), completed, userId);
      return res.json(updateGoal);
    } catch (error) {
      if (error instanceof GoalNotFoundError) {
        return res.status(404).json({ error: error.message });
      }
      console.error('Erreur lors de la mise à jour de l’objectif :', error);
      return res.status(500).json({ error: 'Erreur lors de la mise à jour.' });
    }
  },

  delete: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId;
      const { id } = req.params;

      if (!userId) {
        return res.status(401).json({ error: 'Utilisateur non authentifié.' });
      }

      await goalService.deleteGoal(Number(id), userId);
      return res.json({ message: 'Objectif supprimé avec succès' });
    } catch (error) {
      if (error instanceof GoalNotFoundError) {
        return res.status(404).json({ error: error.message });
      }
      console.error('Erreur lors de la suppression de l’objectif :', error);
      return res.status(500).json({ error: 'Erreur lors de la suppression.' });
    }
  }
};