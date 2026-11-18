/**
 * @file goalService.ts
 * @description Regroupe les appels API de gestion des objectifs et du graphique.
 * @author Copilot
 * @date 2026-11-18
 * @version 1.0.0
 * @license MIT
 */

import { apiRequest } from '../../../lib/apiClient';
import type { Goal, GoalDay, GoalPriority } from '../types/goal.types';
import type { GoalGraphApiItem, GoalPriorityFilter } from '../types/goalGraph.types';

export interface CreateGoalInput {
  text: string;
  priority: GoalPriority;
  days: GoalDay[];
}

export const goalService = {
  getAll(): Promise<Goal[]> {
    return apiRequest<Goal[]>('goals');
  },

  create(input: CreateGoalInput): Promise<Goal[]> {
    return apiRequest<Goal[]>('goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
  },

  toggle(id: number, completed: boolean): Promise<Goal> {
    return apiRequest<Goal>(`goals/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    });
  },

  delete(id: number): Promise<void> {
    return apiRequest<void>(`goals/${id}`, { method: 'DELETE' });
  },

  getGraph(priority: GoalPriorityFilter): Promise<[GoalGraphApiItem[], GoalGraphApiItem[]]> {
    const suffix = priority === 'Tous' ? '' : `/priority/${encodeURIComponent(priority)}`;
    return Promise.all([
      apiRequest<GoalGraphApiItem[]>(`goals/graph${suffix}`),
      apiRequest<GoalGraphApiItem[]>(`goals/graph/completed${suffix}`),
    ]);
  },
};
