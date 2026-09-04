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
import { Prisma } from '@prisma/client';

export const goalController = {
  create: async (req: Request, res: Response) => {
    try {
      const { text, priority, day } = req.body;

      // Petite validation "middleware" simplifiée ici
      if (!text) {
        return res.status(400).json({ error: "Le texte est obligatoire" });
      }

      const newGoal = await goalService.createGoal(text, priority, day);
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
  },
  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deletedGoal = await goalService.deleteGoal(Number(id));
      if (deletedGoal) {
        res.json({ message: "Objectif supprimé avec succès" });
      } else {
        res.status(404).json({ error: "Objectif non trouvé" });
      }
    } catch (error) {
      console.error('Error in delete:', error);
      res.status(500).json({ error: "Erreur lors de la suppression" });
    }
  }
  
};