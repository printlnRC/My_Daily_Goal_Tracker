/** 
 * @file goalRoutes.ts
 * @description Routes pour gérer les objectifs (goals) de l'application.
 * @version 1.0
 * @author Sooz (Sam)
 * @date 2026-03-02
 * @license MIT
 */

import { Router } from 'express';
import { goalController } from '../controllers/goalController.js';
import { goalGraphController } from '../controllers/goalGraph.js';

const router = Router();

/**
 * * @brief Route pour créer un nouvel objectif (goal).
 * * @description Cette route reçoit une requête POST avec les données d'un nouvel objectif (texte et priorité) dans le corps de la requête. Elle utilise le contrôleur `goalController.create` pour traiter la création de l'objectif et renvoie l'objet créé en réponse.
 */
router.post('/', goalController.create);

/**
 * * @brief Route pour récupérer tous les objectifs (goals).
 * * @description Cette route reçoit une requête GET et utilise le contrôleur `goalController.findAll` pour récupérer tous les objectifs et les renvoyer en réponse.
 */
router.get('/', goalController.findAll);

/**
 * * @brief Route pour mettre à jour le statut "completed"
 * * @description Cette route reçoit une requête PATCH avec l'ID d'un objectif dans les paramètres de la route. Elle utilise le contrôleur `goalController.toggle` pour basculer le statut "completed" de l'objectif et renvoie l'objet mis à jour en réponse.
 */
router.patch('/:id', goalController.toggle);

/**
 * * @brief Route pour récupérer les données du graphique.
 * * @description Cette route reçoit une requête GET et utilise le contrôleur `goalGraphController.getGraphData` pour récupérer les données du graphique et les renvoyer en réponse.
 */
router.get('/graph', goalGraphController.getNbGoalPerDay);

/** 
 * @brief Route pour récupérer les données du graphique des objectifs terminés.
 * @description Cette route reçoit une requête GET et utilise le contrôleur `goalGraphController.getCompletedGoalsPerDay` pour récupérer les données du graphique et les renvoyer en réponse.
 */
router.get('/graph/completed', goalGraphController.getCompletedGoalsPerDay);

/**
 * @brief Route pour récupérer les données du graphique des objectifs par priorité.
 * @description Cette route reçoit une requête GET avec la priorité dans les paramètres de la route. Elle utilise le contrôleur `goalGraphController.getNbGoalPerDayByPriority` pour récupérer les données du graphique et les renvoyer en réponse.
 */
router.get('/graph/priority/:priority', goalGraphController.getNbGoalPerDayByPriority);

/**
 * @brief Route pour récupérer les données du graphique des objectifs terminés par priorité.
 * @description Cette route reçoit une requête GET avec la priorité dans les paramètres de la route. Elle utilise le contrôleur `goalGraphController.getCompletedGoalsPerDayByPriority` pour récupérer les données du graphique et les renvoyer en réponse.
 */
router.get('/graph/completed/priority/:priority', goalGraphController.getCompletedGoalsPerDayByPriority);


export default router;