import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

export const goalSchema = z.object({
  text: z.string().trim().min(2, 'Le titre doit contenir au moins 2 caractères').max(200, 'Le titre est trop long'),
  priority: z.enum(['Sigma', 'Indispensable', 'Cool'], {
    errorMap: () => ({ message: 'Priorité invalide' }),
  }),
  day: z.enum(['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI', 'DIMANCHE'], {
    errorMap: () => ({ message: 'Jour invalide' }),
  }),
});
