/**
 * @file goal.types.ts
 * @description Déclare les types et constantes partagés pour les objectifs.
 * @author Copilot
 * @date 2026-11-18
 * @version 1.0.0
 * @license MIT
 */

export const DAYS = [
  'LUNDI',
  'MARDI',
  'MERCREDI',
  'JEUDI',
  'VENDREDI',
  'SAMEDI',
  'DIMANCHE',
] as const;

export type GoalDay = typeof DAYS[number];
export type GoalPriority = 'Sigma' | 'Indispensable' | 'Cool';

export interface Goal {
  id: number;
  text: string;
  day: GoalDay;
  priority: GoalPriority;
  completed: boolean;
  createdAt: string;
}

export const DAYS_MAP: Record<GoalDay, { order: number; label: string }> = {
  LUNDI: { order: 1, label: 'Lun' },
  MARDI: { order: 2, label: 'Mar' },
  MERCREDI: { order: 3, label: 'Mer' },
  JEUDI: { order: 4, label: 'Jeu' },
  VENDREDI: { order: 5, label: 'Ven' },
  SAMEDI: { order: 6, label: 'Sam' },
  DIMANCHE: { order: 7, label: 'Dim' },
};
