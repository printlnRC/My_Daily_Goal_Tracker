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
 */
    async getNbGoalPerDay(userId: number) {
        return await prisma.goal.groupBy({
            by: ['day'],
            where: { userId },
            _count: {
                day: true,
            },
        });
    },

    /**
     * @brief Fonction pour récupérer le nombre d'objectifs (goals) terminés par jour de la semaine.
     * @returns Un objet contenant le nombre d'objectifs terminés pour chaque jour de la semaine.
     */
    async getCompletedGoalsPerDay(userId: number) {
        return await prisma.goal.groupBy({
            by: ['day'],
            where: {
                userId,
                completed: true,
            },
            _count: {
                day: true,
            },
        });
    },

    /**
     * @brief Fonction pour récupérer le nombre d'objectifs (goals) par jour de la semaine selon une priorité spécifique.
     * @param priority La priorité pour laquelle filtrer les objectifs.
     * @returns Un objet contenant le nombre d'objectifs pour chaque jour de la semaine.
     */
    async getNbGoalPerDayByPriority(priority: string, userId: number) {
        return await prisma.goal.groupBy({
            by: ['day'],
            where: {
                userId,
                priority: priority,
            },
            _count: {
                day: true,
            },
        });
    },

    /**
     * @brief Fonction pour récupérer le nombre d'objectifs (goals) terminés par jour de la semaine selon une priorité spécifique.
     * @param priority La priorité pour laquelle filtrer les objectifs terminés.
     * @returns Un objet contenant le nombre d'objectifs terminés pour chaque jour de la semaine.
     */
    async getCompletedGoalsPerDayByPriority(priority: string, userId: number) {
        return await prisma.goal.groupBy({
            by: ['day'],
            where: {
                userId,
                completed: true,
                priority: priority,
            },
            _count: {
                day: true,
            },
        });
    }
}

