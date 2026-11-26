/**
 * @file goalOccurrence.service.ts
 * @description Crée et lit les occurrences hebdomadaires des objectifs d’un utilisateur.
 * @author Sooz (Sam) et Copilot
 * @date 2026-11-26
 * @version 1.0.0
 * @license MIT
 */

import type { Prisma, PrismaClient } from '@prisma/client';
import prisma from '../lib/prisma.js';
import { getParisWeekEndInstant } from '../lib/week.js';

type DatabaseClient = PrismaClient | Prisma.TransactionClient;

export async function ensureGoalOccurrencesForWeek(
  userId: number,
  weekStart: Date,
  database: DatabaseClient = prisma,
): Promise<void> {
  const goals = await database.goal.findMany({
    where: {
      userId,
      createdAt: { lt: getParisWeekEndInstant(weekStart) },
    },
    select: {
      id: true,
      text: true,
      priority: true,
      day: true,
    },
  });

  if (goals.length === 0) return;

  await database.goalOccurrence.createMany({
    data: goals.map((goal) => ({
      userId,
      goalId: goal.id,
      weekStart,
      text: goal.text,
      priority: goal.priority,
      day: goal.day,
      completed: false,
    })),
    skipDuplicates: true,
  });
}
