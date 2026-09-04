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
   * @returns L'objectif créé.
   */
  async createGoal(text: string, priority: string, day: string) {
    return await prisma.goal.create({
      data: {
        text,
        priority,
        day,
        completed: false
      }
    });
  },

  /**
   * @brief Fonction pour récupérer tous les objectifs (goals) de la base de données.
   * @returns Un tableau contenant tous les objectifs.
   */
  async getAllGoals() {
    return await prisma.goal.findMany({
      orderBy: { createdAt: 'desc' }
    });
  },

  /**
   * @brief Fonction pour basculer le statut d'un objectif (goal) entre complété et non complété.
   * @param id - L'identifiant de l'objectif à basculer.
   * @param completed - Le nouveau statut de complétion de l'objectif (true pour complété, false pour non complété).
   * @returns L'objectif mis à jour avec le nouveau statut de complétion.
   * @throws Une erreur si la mise à jour échoue.
   * 
   * Cette fonction utilise Prisma pour mettre à jour le champ "completed" d'un objectif dans la base de données en fonction de son identifiant. Elle est utilisée pour gérer les interactions de l'utilisateur avec les cases à cocher dans l'interface utilisateur, permettant ainsi de marquer les objectifs comme complétés ou non complétés.
   */
  async toggleGoal(id: number, completed: boolean) {
    return await prisma.goal.update({
      where: { id },
      data: { completed },
    });
  },
  /**
   * @brief Fonction pour supprimer un objectif (goal) de la base de données.
   * @param id - L'identifiant de l'objectif à supprimer.
   * @returns L'objectif supprimé ou null si l'objectif n'existe pas.
   * @throws Une erreur si la suppression échoue.
   * 
   * Cette fonction utilise Prisma pour supprimer un objectif de la base de données en fonction de son identifiant. Elle est utilisée pour gérer les interactions de l'utilisateur avec l'interface utilisateur, permettant ainsi de supprimer des objectifs existants.
   */
  async deleteGoal(id: number) {
    return await prisma.goal.delete({
      where: { id },
    });
  }
};