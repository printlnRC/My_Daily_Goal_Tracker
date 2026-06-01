/** 
 * @file goalGraph.ts
 * @description Contrôleur pour gérer les graphiques des objectifs (goals) de l'application.
 * Il contient les fonctions pour récupérer les données nécessaires à la génération des graphiques.
 * @version 1.0
 * @author Sooz (Sam)
 * @date 2026-03-02
 * @license MIT
 */

import { Request, Response } from 'express';
import { goalGraphService } from '../services/goalGraph.js';

/**
 * @brief Contrôleur pour gérer les graphiques des objectifs (goals) de l'application.
 * Il contient les fonctions pour récupérer les données nécessaires à la génération des graphiques.
 * Ces fonctions sont utilisées dans les routes correspondantes pour traiter les requêtes HTTP liées aux graphiques.
 */
export const goalGraphController = {

  /** 
   * @brief Récupère le nombre d'objectifs par jour.
   * @param req - La requête HTTP.
   * @param res - La réponse HTTP.
   */
  getNbGoalPerDay: async (_req: Request, res: Response) => {
    try {
      const graphData = await goalGraphService.getNbGoalPerDay();
      res.json(graphData);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la récupération des données du graphe" });
    }
  },

  /** 
   * @brief Récupère le nombre d'objectifs terminés par jour.
   * @param req - La requête HTTP.
   * @param res - La réponse HTTP.
   */
  getCompletedGoalsPerDay: async (_req: Request, res: Response) => {
    try {
      const graphData = await goalGraphService.getCompletedGoalsPerDay();
      res.json(graphData);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la récupération des données du graphe" });
    }
  }
};