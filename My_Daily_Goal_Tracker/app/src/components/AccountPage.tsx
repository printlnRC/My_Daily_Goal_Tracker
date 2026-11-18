/**
 * @file AccountPage.tsx
 * @description Affiche les informations du compte et les statistiques des objectifs de l’utilisateur.
 * @author Copilot
 * @date 2026-11-17
 * @version 1.0.0
 * @license MIT
 */

type AccountPageProps = {
  email: string | undefined;
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
  return (
    <main className="mx-auto w-full max-w-2xl">
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
          <button
            type="button"
            className="btn btn-primary mt-4 self-start"
            onClick={onBack}
          >
            Retour à mes objectifs
          </button>
        </div>
      </section>
    </main>
  );
}
