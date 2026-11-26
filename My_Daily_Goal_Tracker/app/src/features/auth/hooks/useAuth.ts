/**
 * @file useAuth.ts
 * @description Gère la restauration de session et les actions d’authentification.
 * @author Sooz (Sam) et Copilot
 * @date 2026-11-18
 * @version 1.0.0
 * @license MIT
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { ApiError, setUnauthorizedHandler } from '../../../lib/apiClient';
import { authService } from '../services/authService';
import type { AuthCredentials, AuthUser } from '../types/auth.types';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const userRef = useRef<AuthUser | null>(null);

  const updateUser = useCallback((nextUser: AuthUser | null) => {
    userRef.current = nextUser;
    setUser(nextUser);
  }, []);

  const handleUnauthorized = useCallback(() => {
    if (userRef.current) {
      updateUser(null);
      toast.error('Session expirée. Veuillez vous reconnecter.');
    }
  }, [updateUser]);

  useEffect(() => {
    setUnauthorizedHandler(handleUnauthorized);
    return () => setUnauthorizedHandler(undefined);
  }, [handleUnauthorized]);

  useEffect(() => {
    let isActive = true;
    localStorage.removeItem('daily-goal-token');
    localStorage.removeItem('daily-goal-user');

    const restoreSession = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (isActive) updateUser(currentUser);
      } catch (restoreError) {
        console.error('Erreur lors de la vérification de la session :', restoreError);
        if (isActive) {
          toast.error(
            restoreError instanceof TypeError
              ? 'API injoignable. Démarre le serveur avec « npm run dev » dans le dossier server.'
              : restoreError instanceof Error
                ? restoreError.message
                : 'Impossible de vérifier la session auprès du serveur.',
          );
        }
      } finally {
        if (isActive) setIsCheckingSession(false);
      }
    };

    void restoreSession();
    return () => {
      isActive = false;
    };
  }, [updateUser]);

  const authenticate = useCallback(async (
    credentials: AuthCredentials,
    action: (values: AuthCredentials) => Promise<AuthUser>,
  ): Promise<boolean> => {
    setIsSubmitting(true);
    setError('');
    try {
      updateUser(await action(credentials));
      return true;
    } catch (authError) {
      setError(
        authError instanceof TypeError
          ? 'API injoignable. Démarre le serveur avec « npm run dev » dans le dossier server.'
          : authError instanceof ApiError
            ? authError.message
            : authError instanceof Error
              ? authError.message
              : 'Une erreur est survenue pendant l’authentification.',
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [updateUser]);

  const login = useCallback(
    (credentials: AuthCredentials) => authenticate(credentials, authService.login),
    [authenticate],
  );

  const register = useCallback(
    (credentials: AuthCredentials) => authenticate(credentials, authService.register),
    [authenticate],
  );

  const logout = useCallback(async () => {
    localStorage.removeItem('daily-goal-token');
    localStorage.removeItem('daily-goal-user');
    updateUser(null);
    setError('');

    try {
      await authService.logout();
    } catch (logoutError) {
      console.error('Erreur lors de la déconnexion :', logoutError);
      toast.error('Impossible de fermer la session sur le serveur.');
    }
  }, [updateUser]);

  return {
    user,
    isCheckingSession,
    isSubmitting,
    error,
    login,
    register,
    logout,
  };
}
