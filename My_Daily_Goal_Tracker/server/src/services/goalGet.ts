/** 
 * @file goalService.ts
 * @description Service pour gérer les objectifs (goals) de l'application.
 * Il contient les fonctions pour créer un objectif, récupérer tous les objectifs et basculer le statut d'un objectif.
 * @version 1.0
 * @author Sooz (Sam)
 * @date 2026-03-02
 * @license MIT
 */

import prisma from '../lib/prisma.js';

export const goalService = {
  /**
   * @brief Fonction pour créer un nouvel objectif (goal) dans la base de données.
   * @param text - Le texte de l'objectif.
   * @param priority - La priorité de l'objectif.
   * @param day - Le jour de la semaine associé à l'objectif (calculé automatiquement).
   * @param userId - L'identifiant de l'utilisateur authentifié.
   * @returns L'objectif créé.
   */
  async createGoal(text: string, priority: string, day: string, userId: number) {
    return await prisma.goal.create({
      data: {
        text,
        priority,
        day,
        completed: false,
        userId,
      }
    });
  },

  /**
   * @brief Fonction pour récupérer tous les objectifs (goals) d'un utilisateur.
   * @param userId - L'identifiant de l'utilisateur authentifié.
   * @returns Un tableau contenant tous les objectifs.
   */
  async getAllGoals(userId: number) {
    return await prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  },

  /**
   * @brief Fonction pour basculer le statut d'un objectif (goal) entre complété et non complété.
   * @param id - L'identifiant de l'objectif à basculer.
   * @param completed - Le nouveau statut de complétion de l'objectif (true pour complété, false pour non complété).
   * @param userId - L'identifiant de l'utilisateur authentifié.
   * @returns L'objectif mis à jour avec le nouveau statut de complétion.
   */
  async toggleGoal(id: number, completed: boolean, userId: number) {
    return await prisma.goal.update({
      where: { id, userId },
      data: { completed },
    });
  },

  /**
   * @brief Fonction pour supprimer un objectif (goal) de la base de données.
   * @param id - L'identifiant de l'objectif à supprimer.
   * @param userId - L'identifiant de l'utilisateur authentifié.
   * @returns L'objectif supprimé ou null si l'objectif n'existe pas.
   */
  async deleteGoal(id: number, userId: number) {
    return await prisma.goal.delete({
      where: { id, userId },
    });
  }
};