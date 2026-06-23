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
  },

  /** * @brief Récupère le nombre d'objectifs par jour selon une priorité spécifique.
   * @param req - La requête HTTP.
   * @param res - La réponse HTTP.
   */
  getNbGoalPerDayByPriority: async (req: Request, res: Response) => {
    const { priority } = req.params;
    try {
      let graphData;
      
      // Si la priorité est "Tous", on appelle la fonction globale que tu as déjà codée !
      if (priority === 'Tous') {
        graphData = await goalGraphService.getNbGoalPerDay();
      } else {
        graphData = await goalGraphService.getNbGoalPerDayByPriority(priority);
      }
      
      res.json(graphData);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la récupération des données du graphe par priorité" });
    }
  },

  /** * @brief Récupère le nombre d'objectifs terminés par jour selon une priorité spécifique.
   * @param req - La requête HTTP.
   * @param res - La réponse HTTP.
   */
  getCompletedGoalsPerDayByPriority: async (req: Request, res: Response) => {
    const { priority } = req.params;
    try {
      let graphData;
      
      // Même logique : si "Tous", on utilise ton deuxième contrôleur existant
      if (priority === 'Tous') {
        graphData = await goalGraphService.getCompletedGoalsPerDay();
      } else {
        graphData = await goalGraphService.getCompletedGoalsPerDayByPriority(priority);
      }
      
      res.json(graphData);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la récupération des données du graphe par priorité" });
    }
  }
};