/**
 * @file AuthPage.tsx
 * @description Présente les formulaires de connexion et de création de compte.
 * @author Sooz (Sam) et Copilot
 * @date 2026-11-18
 * @version 1.0.0
 * @license MIT
 */

import { useState } from 'react';
import LoginForm from '../features/auth/components/LoginForm';
import RegisterForm from '../features/auth/components/RegisterForm';
import type { AuthCredentials } from '../features/auth/types/auth.types';

type AuthPageProps = {
  error: string;
  isSubmitting: boolean;
  onLogin: (credentials: AuthCredentials) => Promise<boolean>;
  onRegister: (credentials: AuthCredentials) => Promise<boolean>;
};

export default function AuthPage({
  error,
  isSubmitting,
  onLogin,
  onRegister,
}: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-300">
        <div className="card-body">
          <div className="text-center mb-6">
            <p className="text-sm uppercase tracking-[0.3em] text-primary">Daily Goal Tracker</p>
            <h1 className="text-3xl font-black mt-2">
              {mode === 'login' ? 'Connexion' : 'Créer un compte'}
            </h1>
          </div>

          <div role="tablist" className="tabs tabs-boxed mb-5">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'login'}
              className={`tab ${mode === 'login' ? 'tab-active' : ''}`}
              onClick={() => setMode('login')}
            >
              Connexion
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'register'}
              className={`tab ${mode === 'register' ? 'tab-active' : ''}`}
              onClick={() => setMode('register')}
            >
              Inscription
            </button>
          </div>

          {mode === 'login' ? (
            <LoginForm error={error} isSubmitting={isSubmitting} onLogin={onLogin} />
          ) : (
            <RegisterForm error={error} isSubmitting={isSubmitting} onRegister={onRegister} />
          )}
        </div>
      </div>
    </div>
  );
}
