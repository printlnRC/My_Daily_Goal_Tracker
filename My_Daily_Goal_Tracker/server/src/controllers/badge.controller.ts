/**
 * @file badge.controller.ts
 * @description Expose les badges obtenus par l’utilisateur authentifié.
 * @version 1.0
 * @author Sooz (Sam) et Copilot
 * @date 2026-11-26
 * @license MIT
 */

import type { Response } from 'express';
import { badgeService } from '../services/badge.service.js';
import type { AuthRequest } from '../middlewares/auth.middleware.js';

export const badgeController = {
  async getAllBadges(req: AuthRequest, res: Response) {
    if (!req.userId) {
      return res.status(401).json({ error: 'Utilisateur non authentifié.' });
    }

    try {
      const badges = await badgeService.getAllBadges(req.userId);
      return res.status(200).json(badges);
    } catch (error) {
      console.error('Erreur lors de la récupération des badges :', error);
      return res.status(500).json({ error: 'Erreur lors de la récupération des badges.' });
    }
  },
};
