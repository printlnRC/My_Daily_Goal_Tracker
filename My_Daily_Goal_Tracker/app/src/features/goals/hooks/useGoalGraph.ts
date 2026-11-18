/**
 * @file useGoalGraph.ts
 * @description Charge les statistiques du graphique et calcule le taux de réalisation hebdomadaire.
 * @author Copilot
 * @date 2026-11-18
 * @version 1.0.0
 * @license MIT
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ApiError } from '../../../lib/apiClient';
import { DAYS_MAP } from '../types/goal.types';
import type { GoalGraphData, GoalPriorityFilter } from '../types/goalGraph.types';
import { goalService } from '../services/goalService';

export function useGoalGraph() {
  const [priorityFilter, setPriorityFilter] = useState<GoalPriorityFilter>('Tous');
  const [graphData, setGraphData] = useState<GoalGraphData[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [totals, completed] = await goalService.getGraph(priorityFilter);
      const weeklyData = Object.entries(DAYS_MAP).map(([key, day]) => ({
        day: day.label,
        qty: totals.find((item) => item.day === key)?._count.day ?? 0,
        completed: completed.find((item) => item.day === key)?._count.day ?? 0,
        order: day.order,
      }));
      setGraphData(weeklyData);
    } finally {
      setLoading(false);
    }
  }, [priorityFilter]);

  useEffect(() => {
    void refresh().catch((error: unknown) => {
      if (error instanceof ApiError && error.status === 401) return;
      console.error('Erreur lors de la récupération des données graphiques :', error);
      toast.error('Impossible de charger le graphique');
    });
  }, [refresh]);

  const weeklyCompletionPercentage = useMemo(() => {
    const total = graphData.reduce((sum, day) => sum + day.qty, 0);
    const completed = graphData.reduce((sum, day) => sum + day.completed, 0);
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  }, [graphData]);

  return {
    graphData,
    loading,
    priorityFilter,
    setPriorityFilter,
    refresh,
    weeklyCompletionPercentage,
  };
}
