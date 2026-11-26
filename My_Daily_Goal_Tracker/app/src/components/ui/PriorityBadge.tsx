/**
 * @file PriorityBadge.tsx
 * @description Affiche le badge coloré correspondant à la priorité d’un objectif.
 * @author Sooz (Sam) et Copilot
 * @date 2026-11-18
 * @version 1.0.0
 * @license MIT
 */

import type { GoalPriority } from '../../features/goals/types/goal.types';

const priorityClasses: Record<GoalPriority, string> = {
  Sigma: 'badge-primary',
  Indispensable: 'badge-error',
  Cool: 'badge-ghost',
};

export default function PriorityBadge({ priority }: { priority: GoalPriority }) {
  return <span className={`badge badge-sm ${priorityClasses[priority]}`}>{priority}</span>;
}
