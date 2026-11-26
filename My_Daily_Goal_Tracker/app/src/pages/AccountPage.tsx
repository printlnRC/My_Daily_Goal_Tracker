/**
 * @file AccountPage.tsx
 * @description Affiche les informations du compte et les statistiques des objectifs.
 * @author Sooz (Sam) et Copilot
 * @date 2026-11-18
 * @version 1.0.0
 * @license MIT
 */

import beginnerBadge from '../assets/badges/beginner_badge.png';
import midBadge from '../assets/badges/mid_badge.png';
import noobBadge from '../assets/badges/noob_badge.png';
import sigmaBadge from '../assets/badges/sigma_badge.png';
import { useBadges } from '../features/badges/hooks/useBadges';
import type { BadgeName } from '../features/badges/types/badge.types';

type AccountPageProps = {
  email: string;
  goalCount: number;
  completedGoalCount: number;
  onBack: () => void;
};

export default function AccountPage({
  email,
  goalCount,
  completedGoalCount,
  onBack,
}: AccountPageProps) {
  const { badges, loading: badgesLoading } = useBadges();
  const badgeImages: Record<BadgeName, string> = {
    noob_badge: noobBadge,
    beginner_badge: beginnerBadge,
    mid_badge: midBadge,
    sigma_badge: sigmaBadge,
  };
  const badgeLabels: Record<BadgeName, string> = {
    noob_badge: 'Débutant',
    beginner_badge: 'En progression',
    mid_badge: 'Confirmé',
    sigma_badge: 'Sigma',
  };

  return (
    <main className="mx-auto w-full max-w-4xl">
      <section className="card border border-base-300 bg-base-200 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-primary">Mon compte</h2>
          <p>Adresse email : {email}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="stat rounded-box bg-base-100 shadow">
              <div className="stat-title">Objectifs créés</div>
              <div className="stat-value text-primary">{goalCount}</div>
            </div>
            <div className="stat rounded-box bg-base-100 shadow">
              <div className="stat-title">Objectifs réussis</div>
              <div className="stat-value text-success">{completedGoalCount}</div>
            </div>
          </div>
          <section aria-labelledby="badges-title" className="mt-4">
            <h3 id="badges-title" className="text-lg font-bold text-primary">Mes badges hebdomadaires</h3>
            <p className="mt-1 text-sm text-base-content/70">
              Le dimanche à 23 h 59 (heure de Paris), le meilleur palier atteint est attribué :
              25 %, 50 %, 75 % ou 100 %.
            </p>
            {badgesLoading ? (
              <div className="flex justify-center p-6">
                <span className="loading loading-spinner loading-md text-primary" aria-label="Chargement des badges" />
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {badges.map((badge) => (
                  <article
                    key={badge.id}
                    className="flex flex-col items-center rounded-box bg-base-100 p-4 text-center shadow"
                  >
                    <img
                      src={badgeImages[badge.name]}
                      alt={`Badge ${badgeLabels[badge.name]}`}
                      className={`h-20 w-20 object-contain ${badge.count === 0 ? 'opacity-40 grayscale' : ''}`}
                    />
                    <h4 className="mt-2 font-semibold">{badgeLabels[badge.name]}</h4>
                    <p className="text-sm text-base-content/70">Palier {badge.threshold} %</p>
                    <p className="mt-1 text-sm font-bold">Obtenu {badge.count} fois</p>
                  </article>
                ))}
              </div>
            )}
          </section>
          <button type="button" className="btn btn-primary mt-4 self-start" onClick={onBack}>
            Retour à mes objectifs
          </button>
        </div>
      </section>
    </main>
  );
}
