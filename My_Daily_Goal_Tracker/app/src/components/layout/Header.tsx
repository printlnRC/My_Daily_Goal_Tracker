/**
 * @file Header.tsx
 * @description Affiche l’en-tête du site et la navigation du compte connecté.
 * @author Copilot
 * @date 2026-11-18
 * @version 1.0.0
 * @license MIT
 */

import { UserRound } from 'lucide-react';
import type { AuthUser } from '../../features/auth/types/auth.types';

export type PageNavigation = 'goals' | 'account';

type SiteHeaderProps = {
  onNavigate: (page: PageNavigation) => void;
  user: AuthUser;
  onLogout: () => void;
};

export default function SiteHeader({ onNavigate, user, onLogout }: SiteHeaderProps) {
  return (
    <header className="mb-3 flex items-center justify-between gap-4">
      <div>
        <button
          type="button"
          className="text-left text-4xl font-black italic text-primary"
          onClick={() => onNavigate('goals')}
        >
          DAILY GOAL TRACKER
        </button>
        <p className="mt-1 text-sm text-base-content/70">
          Connecté en tant que {user.email}
        </p>
      </div>

      <details className="dropdown dropdown-end">
        <summary
          className="btn btn-ghost btn-circle list-none"
          aria-label="Menu du compte"
        >
          <UserRound size={20} />
        </summary>
        <ul className="menu dropdown-content z-50 mt-2 w-52 rounded-box bg-base-100 p-2 shadow-lg">
          <li className="menu-title">
            <span className="break-all">{user.email}</span>
          </li>
          <li>
            <button
              type="button"
              onClick={(event) => {
                event.currentTarget.closest('details')?.removeAttribute('open');
                onNavigate('account');
              }}
            >
              Mon compte
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={(event) => {
                event.currentTarget.closest('details')?.removeAttribute('open');
                onNavigate('goals');
              }}
            >
              Mes objectifs
            </button>
          </li>
          <li>
            <button type="button" onClick={onLogout}>
              Déconnexion
            </button>
          </li>
        </ul>
      </details>
    </header>
  );
}
