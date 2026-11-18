/**
 * @file authService.ts
 * @description Regroupe les appels API liés à la session et aux comptes utilisateur.
 * @author Copilot
 * @date 2026-11-18
 * @version 1.0.0
 * @license MIT
 */

import { ApiError, apiRequest } from '../../../lib/apiClient';
import type { AuthCredentials, AuthUser } from '../types/auth.types';

type AuthResponse = {
  user: AuthUser;
};

export const authService = {
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const response = await apiRequest<AuthResponse>(
        'auth/me',
        {},
        { skipUnauthorizedHandler: true },
      );
      return response.user;
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        return null;
      }
      throw error;
    }
  },

  async login(credentials: AuthCredentials): Promise<AuthUser> {
    const response = await apiRequest<AuthResponse>(
      'auth/login',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      },
      { skipUnauthorizedHandler: true },
    );
    return response.user;
  },

  async register(credentials: AuthCredentials): Promise<AuthUser> {
    const response = await apiRequest<AuthResponse>(
      'auth/register',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      },
      { skipUnauthorizedHandler: true },
    );
    return response.user;
  },

  async logout(): Promise<void> {
    await apiRequest<void>('auth/logout', { method: 'POST' });
  },
};
