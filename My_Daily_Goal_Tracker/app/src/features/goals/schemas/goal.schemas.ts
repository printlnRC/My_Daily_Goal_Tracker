/**
 * @file goal.schemas.ts
 * @description Définit les règles de validation du formulaire de création d’objectif.
 * @author Copilot
 * @date 2026-11-18
 * @version 1.0.0
 * @license MIT
 */

import { z } from 'zod';

export const goalSchema = z.object({
  text: z.string().trim().min(2, 'Le titre doit contenir au moins 2 caractères').max(200, 'Le titre est trop long'),
  priority: z.enum(['Sigma', 'Indispensable', 'Cool']),
  days: z.array(z.enum(['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI', 'DIMANCHE']))
    .min(1, 'Sélectionne au moins un jour'),
});
