/**
 * @file useBadges.ts
 * @description Charge les compteurs des badges gagnés par l’utilisateur connecté.
 * @author Sooz (Sam) et Copilot
 * @date 2026-11-26
 * @version 1.0.0
 * @license MIT
 */

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ApiError } from '../../../lib/apiClient';
import { badgeService } from '../services/badgeService';
import type { UserBadge } from '../types/badge.types';

export function useBadges() {
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void badgeService.getAll()
      .then((data) => {
        if (active) setBadges(data);
      })
      .catch((error: unknown) => {
        if (error instanceof ApiError && error.status === 401) return;
        console.error('Erreur lors du chargement des badges :', error);
        if (active) toast.error('Impossible de charger les badges.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { badges, loading };
}
