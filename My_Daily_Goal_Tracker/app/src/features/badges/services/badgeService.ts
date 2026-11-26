/**
 * @file badgeService.ts
 * @description Récupère les badges gagnés et leurs compteurs depuis l’API.
 * @author Sooz (Sam) et Copilot
 * @date 2026-11-26
 * @version 1.0.0
 * @license MIT
 */

import { apiRequest } from '../../../lib/apiClient';
import type { UserBadge } from '../types/badge.types';

export const badgeService = {
  getAll(): Promise<UserBadge[]> {
    return apiRequest<UserBadge[]>('badges');
  },
};
