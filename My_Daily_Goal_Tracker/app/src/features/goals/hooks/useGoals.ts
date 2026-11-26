/**
 * @file useGoals.ts
 * @description Gère le chargement et les opérations CRUD des objectifs utilisateur.
 * @author Sooz (Sam) et Copilot
 * @date 2026-11-18
 * @version 1.0.0
 * @license MIT
 */

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ApiError } from '../../../lib/apiClient';
import { goalService } from '../services/goalService';
import type { CreateGoalInput } from '../services/goalService';
import type { Goal } from '../types/goal.types';
import { useGoalGraph } from './useGoalGraph';

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loadingGoals, setLoadingGoals] = useState(true);
  const goalGraph = useGoalGraph();

  const refreshGoals = useCallback(async () => {
    setLoadingGoals(true);
    try {
      setGoals(await goalService.getAll());
    } finally {
      setLoadingGoals(false);
    }
  }, []);

  useEffect(() => {
    void refreshGoals().catch((error: unknown) => {
      if (error instanceof ApiError && error.status === 401) return;
      console.error('Erreur lors du chargement des objectifs :', error);
      toast.error('Impossible de charger les données');
    });
  }, [refreshGoals]);

  const addGoals = useCallback(async (input: CreateGoalInput) => {
    const createdGoals = await goalService.create(input);
    setGoals((currentGoals) => [...createdGoals, ...currentGoals]);
    await goalGraph.refresh();
    return createdGoals;
  }, [goalGraph.refresh]);

  const toggleGoal = useCallback(async (id: number, completed: boolean) => {
    const updatedGoal = await goalService.toggle(id, completed);
    setGoals((currentGoals) => currentGoals.map((goal) =>
      goal.id === id ? updatedGoal : goal,
    ));
    await goalGraph.refresh();
    return updatedGoal;
  }, [goalGraph.refresh]);

  const deleteGoal = useCallback(async (id: number) => {
    await goalService.delete(id);
    setGoals((currentGoals) => currentGoals.filter((goal) => goal.id !== id));
    await goalGraph.refresh();
  }, [goalGraph.refresh]);

  return {
    goals,
    loadingGoals,
    addGoals,
    toggleGoal,
    deleteGoal,
    ...goalGraph,
  };
}
