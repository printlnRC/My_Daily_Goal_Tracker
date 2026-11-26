/**
 * @file LoginForm.tsx
 * @description Affiche le formulaire de connexion et valide ses champs.
 * @author Sooz (Sam) et Copilot
 * @date 2026-11-18
 * @version 1.0.0
 * @license MIT
 */

import { useState, type FormEvent } from 'react';
import { loginSchema } from '../schemas/auth.schemas';
import type { AuthCredentials } from '../types/auth.types';

type LoginFormProps = {
  error: string;
  isSubmitting: boolean;
  onLogin: (credentials: AuthCredentials) => Promise<boolean>;
};

export default function LoginForm({ error, isSubmitting, onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setValidationError(parsed.error.issues[0].message);
      return;
    }

    setValidationError('');
    if (await onLogin(parsed.data)) {
      setEmail('');
      setPassword('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <label className="form-control w-full">
        <span className="label-text mb-2">Email</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="input input-bordered w-full focus:outline-none focus:ring-0 focus:border-primary"
          placeholder="nom@exemple.com"
          disabled={isSubmitting}
        />
      </label>

      <label className="form-control w-full">
        <span className="label-text mb-2">Mot de passe</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="input input-bordered w-full focus:outline-none focus:ring-0 focus:border-primary"
          placeholder="••••••••"
          disabled={isSubmitting}
        />
      </label>

      {(validationError || error) && (
        <div className="alert alert-error text-sm py-2">{validationError || error}</div>
      )}

      <button type="submit" className="btn btn-primary w-full mt-2" disabled={isSubmitting}>
        {isSubmitting ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>
  );
}
