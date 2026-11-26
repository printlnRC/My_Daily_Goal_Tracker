/**
 * @file goalGraph.types.ts
 * @description Déclare les types des données utilisées par le graphique des objectifs.
 * @author Sooz (Sam) et Copilot
 * @date 2026-11-18
 * @version 1.0.0
 * @license MIT
 */

import type { GoalDay } from './goal.types';

export interface GoalGraphData {
  day: string;
  qty: number;
  completed: number;
  order: number;
}

export interface GoalGraphApiItem {
  day: GoalDay;
  _count: {
    day: number;
  };
}

export type GoalPriorityFilter = 'Tous' | 'Sigma' | 'Indispensable' | 'Cool';
