/**
 * @file badge.routes.ts
 * @description Déclare les routes protégées de consultation des badges.
 * @version 1.0
 * @author Sooz (Sam) et Copilot
 * @date 2026-11-26
 * @license MIT
 */

import { Router } from 'express';
import { badgeController } from '../controllers/badge.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', authenticateToken, badgeController.getAllBadges);

export default router;
