/**
 * @file goal.service.ts
 * @description Gère les objectifs et leur progression hebdomadaire en base de données.
 * @version 1.0
 * @author Sooz (Sam) et Copilot
 * @date 2026-11-26
 * @license MIT
 */

import prisma from '../lib/prisma.js';
import { getParisWeekStart } from '../lib/week.js';
import { ensureGoalOccurrencesForWeek } from './goalOccurrence.service.js';

export class GoalNotFoundError extends Error {
  constructor() {
    super('Objectif non trouvé.');
    this.name = 'GoalNotFoundError';
  }
}

export const goalService = {
  async createGoals(text: string, priority: string, days: string[], userId: number) {
    const weekStart = getParisWeekStart();

    return prisma.$transaction(async (transaction) => {
      const goals = await Promise.all(days.map((day) => transaction.goal.create({
        data: { text, priority, day, userId, completed: false },
      })));

      await transaction.goalOccurrence.createMany({
        data: goals.map((goal) => ({
          userId,
          goalId: goal.id,
          weekStart,
          text: goal.text,
          priority: goal.priority,
          day: goal.day,
        })),
      });

      return goals.map((goal) => ({ ...goal, completed: false }));
    });
  },

  async getAllGoals(userId: number) {
    const weekStart = getParisWeekStart();
    await ensureGoalOccurrencesForWeek(userId, weekStart);

    const goals = await prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    if (goals.length === 0) return [];

    const occurrences = await prisma.goalOccurrence.findMany({
      where: {
        userId,
        weekStart,
        goalId: { in: goals.map((goal) => goal.id) },
      },
      select: { goalId: true, completed: true },
    });
    const completedByGoalId = new Map(
      occurrences.map((occurrence) => [occurrence.goalId, occurrence.completed]),
    );

    return goals.map((goal) => ({
      ...goal,
      completed: completedByGoalId.get(goal.id) ?? false,
    }));
  },

  async toggleGoal(id: number, completed: boolean, userId: number) {
    const weekStart = getParisWeekStart();

    return prisma.$transaction(async (transaction) => {
      const goal = await transaction.goal.findFirst({ where: { id, userId } });
      if (!goal) throw new GoalNotFoundError();

      await ensureGoalOccurrencesForWeek(userId, weekStart, transaction);
      await transaction.goalOccurrence.update({
        where: {
          userId_goalId_weekStart: { userId, goalId: id, weekStart },
        },
        data: { completed },
      });

      return transaction.goal.update({
        where: { id },
        data: { completed },
      });
    });
  },

  async deleteGoal(id: number, userId: number) {
    const weekStart = getParisWeekStart();

    return prisma.$transaction(async (transaction) => {
      await ensureGoalOccurrencesForWeek(userId, weekStart, transaction);
      const goal = await transaction.goal.findFirst({ where: { id, userId } });
      if (!goal) throw new GoalNotFoundError();

      return transaction.goal.delete({ where: { id } });
    });
  },
};
