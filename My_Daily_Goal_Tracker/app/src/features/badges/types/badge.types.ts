/**
 * @file badge.types.ts
 * @description Déclare les types des badges et de leurs compteurs utilisateur.
 * @author Sooz (Sam) et Copilot
 * @date 2026-11-26
 * @version 1.0.0
 * @license MIT
 */

export type BadgeName =
  | 'noob_badge'
  | 'beginner_badge'
  | 'mid_badge'
  | 'sigma_badge';

export interface UserBadge {
  id: number;
  name: BadgeName;
  threshold: number;
  count: number;
}
