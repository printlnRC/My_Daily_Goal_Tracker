/**
 * @file week.ts
 * @description Fournit les calculs de semaines et d’horaires dans le fuseau Europe/Paris.
 * @author Sooz (Sam) et Copilot
 * @date 2026-11-26
 * @version 1.0.0
 * @license MIT
 */

const TIME_ZONE = 'Europe/Paris';
const WEEKDAY_INDEX: Record<string, number> = {
  Mon: 0,
  Tue: 1,
  Wed: 2,
  Thu: 3,
  Fri: 4,
  Sat: 5,
  Sun: 6,
};

type ParisDateParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  weekday: number;
};

function getParisDateParts(date: Date): ParisDateParts {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
    weekday: 'short',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  const weekday = WEEKDAY_INDEX[values.weekday];

  if (weekday === undefined) {
    throw new Error(`Impossible de déterminer le jour de semaine pour ${TIME_ZONE}.`);
  }

  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    hour: Number(values.hour),
    minute: Number(values.minute),
    second: Number(values.second),
    weekday,
  };
}

function parisLocalTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second = 0,
): Date {
  const targetAsUtc = Date.UTC(year, month - 1, day, hour, minute, second);
  let candidate = targetAsUtc;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const paris = getParisDateParts(new Date(candidate));
    const representedAsUtc = Date.UTC(
      paris.year,
      paris.month - 1,
      paris.day,
      paris.hour,
      paris.minute,
      paris.second,
    );
    const adjustment = targetAsUtc - representedAsUtc;
    candidate += adjustment;
    if (adjustment === 0) break;
  }

  return new Date(candidate);
}

export function getParisWeekStart(date = new Date()): Date {
  const paris = getParisDateParts(date);
  const monday = new Date(Date.UTC(paris.year, paris.month - 1, paris.day - paris.weekday));
  return monday;
}

export function getNextParisWeekStart(weekStart: Date): Date {
  return new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
}

export function getParisWeekEndInstant(weekStart: Date): Date {
  const nextMonday = getNextParisWeekStart(weekStart);
  return parisLocalTimeToUtc(
    nextMonday.getUTCFullYear(),
    nextMonday.getUTCMonth() + 1,
    nextMonday.getUTCDate(),
    0,
    0,
  );
}

export function getMostRecentlyClosedParisWeekStart(date = new Date()): Date {
  const paris = getParisDateParts(date);
  const thisWeekStart = getParisWeekStart(date);
  const isSundayAwardTime = paris.weekday === 6
    && paris.hour === 23
    && paris.minute === 59
    && paris.second === 59;
  return isSundayAwardTime
    ? thisWeekStart
    : new Date(thisWeekStart.getTime() - 7 * 24 * 60 * 60 * 1000);
}

export function getNextParisSundayAwardTime(date = new Date()): Date {
  const paris = getParisDateParts(date);
  const minutesToday = paris.hour * 60 + paris.minute;
  const daysUntilSunday = (6 - paris.weekday + 7) % 7;
  const isAfterAwardTime = minutesToday > 23 * 60 + 59
    || (minutesToday === 23 * 60 + 59 && paris.second >= 59);
  const daysToAdd = daysUntilSunday === 0 && isAfterAwardTime
    ? 7
    : daysUntilSunday;
  const sunday = new Date(Date.UTC(paris.year, paris.month - 1, paris.day + daysToAdd));

  return parisLocalTimeToUtc(
    sunday.getUTCFullYear(),
    sunday.getUTCMonth() + 1,
    sunday.getUTCDate(),
    23,
    59,
    59,
  );
}
