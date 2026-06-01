/** 
 * @file goalGraph.ts
 * @description Service pour gérer les graphiques des objectifs (goals) de l'application.
 * Il contient les fonctions pour récupérer les données nécessaires à la génération des graphiques.
 * @version 1.0
 * @author Sooz (Sam)
 * @date 2026-03-02
 * @license MIT
 */

import prisma from "../lib/prisma.js";

export const goalGraphService = {
    /**
 * @brief Fonction pour récupérer le nombre d'objectifs (goals) créés par jour de la semaine.
 * @returns Un objet contenant le nombre d'objectifs créés pour chaque jour de la semaine.
 * 
 * Cette fonction interagit avec la base de données pour compter le nombre d'objectifs créés pour chaque jour de la semaine. Elle est utilisée pour générer des graphiques qui affichent la répartition des objectifs créés au fil du temps, permettant ainsi à l'utilisateur de visualiser les jours où il est le plus productif.
 * 
 * Exemple de retour :
 * {
 *   "LUNDI": 5,
 *   "MARDI": 3,
 *   "MERCREDI": 7,
 *   "JEUDI": 2,
 *   "VENDREDI": 4,
 *   "SAMEDI": 1,
 *   "DIMANCHE": 0
 * }
 */
    async getNbGoalPerDay() {
        return await prisma.goal.groupBy({
            by: ['day'],
            _count: {
                day: true,
            },
        });
    },

    /**
     * @brief Fonction pour récupérer le nombre d'objectifs (goals) terminés par jour de la semaine.
     * @returns Un objet contenant le nombre d'objectifs terminés pour chaque jour de la semaine.
     */
    async getCompletedGoalsPerDay() {
        return await prisma.goal.groupBy({
            by: ['day'],
            where: {
                completed: true,
            },
            _count: {
                day: true,
            },
        });
    }
}

