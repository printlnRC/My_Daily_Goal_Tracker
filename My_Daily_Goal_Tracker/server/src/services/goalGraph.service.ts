/**
 * @file goalGraph.service.ts
 * @description Fournit les statistiques hebdomadaires des objectifs pour les graphiques.
 * @version 1.0
 * @author Sooz (Sam) et Copilot
 * @date 2026-11-26
 * @license MIT
 */

import prisma from '../lib/prisma.js';

export const goalGraphService = {
  async getNbGoalPerDay(userId: number) {
    return prisma.goal.groupBy({
      by: ['day'],
      where: { userId },
      _count: { day: true },
    });
  },

  async getCompletedGoalsPerDay(userId: number) {
    return prisma.goal.groupBy({
      by: ['day'],
      where: { userId, completed: true },
      _count: { day: true },
    });
  },

  async getNbGoalPerDayByPriority(priority: string, userId: number) {
    return prisma.goal.groupBy({
      by: ['day'],
      where: { userId, priority },
      _count: { day: true },
    });
  },

  async getCompletedGoalsPerDayByPriority(priority: string, userId: number) {
    return prisma.goal.groupBy({
      by: ['day'],
      where: { userId, completed: true, priority },
      _count: { day: true },
    });
  },
};
