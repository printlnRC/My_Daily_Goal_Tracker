/**
 * @file auth.schemas.ts
 * @description Définit les règles de validation des formulaires d’authentification.
 * @author Sooz (Sam) et Copilot
 * @date 2026-11-18
 * @version 1.0.0
 * @license MIT
 */

import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

export const registerSchema = loginSchema;
