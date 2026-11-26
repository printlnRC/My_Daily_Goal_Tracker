/**
 * @file badge.service.ts
 * @description Attribue les badges hebdomadaires et fournit le total obtenu par utilisateur.
 * @version 1.0
 * @author Sooz (Sam) et Copilot
 * @date 2026-11-26
 * @license MIT
 */

import prisma from '../lib/prisma.js';
import { ensureGoalOccurrencesForWeek } from './goalOccurrence.service.js';

export const BADGE_DEFINITIONS = [
  { name: 'noob_badge', threshold: 25 },
  { name: 'beginner_badge', threshold: 50 },
  { name: 'mid_badge', threshold: 75 },
  { name: 'sigma_badge', threshold: 100 },
] as const;

export const badgeService = {
  async ensureBadgeDefinitions(): Promise<void> {
    await Promise.all(BADGE_DEFINITIONS.map(({ name, threshold }) =>
      prisma.badge.upsert({
        where: { name },
        update: { threshold },
        create: { name, threshold },
      }),
    ));
  },

  async awardBadgesForWeek(weekStart: Date): Promise<void> {
    const users = await prisma.user.findMany({ select: { id: true } });

    for (const user of users) {
      await ensureGoalOccurrencesForWeek(user.id, weekStart);

      const existingAward = await prisma.badgeAward.findUnique({
        where: { userId_weekStart: { userId: user.id, weekStart } },
      });
      if (existingAward) continue;

      const total = await prisma.goalOccurrence.count({
        where: { userId: user.id, weekStart },
      });
      if (total === 0) continue;

      const completed = await prisma.goalOccurrence.count({
        where: { userId: user.id, weekStart, completed: true },
      });

      const eligibleBadge = await prisma.badge.findFirst({
        where: {
          threshold: { lte: Math.floor((completed * 100) / total) },
        },
        orderBy: { threshold: 'desc' },
      });
      if (!eligibleBadge) continue;

      await prisma.badgeAward.createMany({
        data: [{
          userId: user.id,
          badgeId: eligibleBadge.id,
          weekStart,
        }],
        skipDuplicates: true,
      });
    }

  },

  async getAllBadges(userId: number) {
    const [badges, awards] = await Promise.all([
      prisma.badge.findMany({ orderBy: { threshold: 'asc' } }),
      prisma.badgeAward.groupBy({
        by: ['badgeId'],
        where: { userId },
        _count: { badgeId: true },
      }),
    ]);
    const countByBadgeId = new Map(
      awards.map((award) => [award.badgeId, award._count.badgeId]),
    );

    return badges.map((badge) => ({
      id: badge.id,
      name: badge.name,
      threshold: badge.threshold,
      count: countByBadgeId.get(badge.id) ?? 0,
    }));
  },
};
