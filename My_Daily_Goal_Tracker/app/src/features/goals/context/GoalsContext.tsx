/**
 * @file GoalsContext.tsx
 * @description Partage l’état des objectifs entre les pages authentifiées.
 * @author Sooz (Sam) et Copilot
 * @date 2026-11-18
 * @version 1.0.0
 * @license MIT
 */

import { createContext, useContext, type PropsWithChildren } from 'react';
import { useGoals } from '../hooks/useGoals';

type GoalsContextValue = ReturnType<typeof useGoals>;

const GoalsContext = createContext<GoalsContextValue | null>(null);

export function GoalsProvider({ children }: PropsWithChildren) {
  const goalsState = useGoals();
  return <GoalsContext.Provider value={goalsState}>{children}</GoalsContext.Provider>;
}

export function useGoalData(): GoalsContextValue {
  const context = useContext(GoalsContext);
  if (!context) {
    throw new Error('useGoalData must be used within a GoalsProvider.');
  }
  return context;
}
