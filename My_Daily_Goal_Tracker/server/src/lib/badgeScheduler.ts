/**
 * @file badgeScheduler.ts
 * @description Planifie l’attribution des badges chaque dimanche à 23 h 59, heure de Paris.
 * @author Sooz (Sam) et Copilot
 * @date 2026-11-26
 * @version 1.0.0
 * @license MIT
 */

import prisma from './prisma.js';
import {
  getMostRecentlyClosedParisWeekStart,
  getNextParisSundayAwardTime,
} from './week.js';
import { badgeService } from '../services/badge.service.js';

const MAX_TIMEOUT = 2_147_000_000;

async function awardWeek(weekStart: Date): Promise<void> {
  await badgeService.awardBadgesForWeek(weekStart);
}

function retryWeek(weekStart: Date): void {
  setTimeout(() => {
    void awardWeek(weekStart).catch((error: unknown) => {
      console.error('Échec du nouvel essai d’attribution des badges :', error);
      retryWeek(weekStart);
    });
  }, 60_000);
}

function scheduleNextAward(): void {
  const now = new Date();
  const nextAwardAt = getNextParisSundayAwardTime(now);
  const delay = Math.min(nextAwardAt.getTime() - now.getTime(), MAX_TIMEOUT);

  setTimeout(async () => {
    const closedWeekStart = getMostRecentlyClosedParisWeekStart();
    try {
      await awardWeek(closedWeekStart);
    } catch (error) {
      console.error('Échec de l’attribution hebdomadaire des badges :', error);
      retryWeek(closedWeekStart);
    } finally {
      scheduleNextAward();
    }
  }, delay);
}

async function initializeScheduler(): Promise<void> {
  try {
    await badgeService.ensureBadgeDefinitions();
    const closedWeekStart = getMostRecentlyClosedParisWeekStart();
    const existingOccurrences = await prisma.goalOccurrence.count({
      where: { weekStart: closedWeekStart },
    });

    if (existingOccurrences > 0) {
      await awardWeek(closedWeekStart);
    }
  } catch (error) {
    console.error('Initialisation du service de badges impossible ; nouvel essai dans une minute :', error);
    setTimeout(() => void initializeScheduler(), 60_000);
  }
}

export function startBadgeScheduler(): void {
  void initializeScheduler();
  scheduleNextAward();
}
