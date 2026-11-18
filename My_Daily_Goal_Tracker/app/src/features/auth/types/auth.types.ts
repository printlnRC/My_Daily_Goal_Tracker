/**
 * @file auth.types.ts
 * @description Déclare les types partagés pour l’authentification.
 * @author Copilot
 * @date 2026-11-18
 * @version 1.0.0
 * @license MIT
 */

export interface AuthUser {
  id: number;
  email: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}
