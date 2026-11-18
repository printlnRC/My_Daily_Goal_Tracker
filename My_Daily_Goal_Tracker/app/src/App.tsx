/**
 * @file App.tsx
 * @description Sélectionne la page affichée selon l’état d’authentification.
 * @author Copilot
 * @date 2026-11-18
 * @version 1.0.0
 * @license MIT
 */

import { useState } from 'react';
import SiteHeader, { type PageNavigation } from './components/layout/Header';
import { useAuth } from './features/auth/hooks/useAuth';
import { GoalsProvider, useGoalData } from './features/goals/context/GoalsContext';
import AccountPage from './pages/AccountPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  const {
    user,
    isCheckingSession,
    isSubmitting,
    error,
    login,
    register,
    logout,
  } = useAuth();

  if (isCheckingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-200">
        <span
          className="loading loading-spinner loading-lg text-primary"
          aria-label="Vérification de la session"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <AuthPage error={error} isSubmitting={isSubmitting} onLogin={login} onRegister={register} />
    );
  }

  return (
    <GoalsProvider>
      <AuthenticatedApp user={user} onLogout={logout} />
    </GoalsProvider>
  );
}

function AuthenticatedApp({
  user,
  onLogout,
}: {
  user: NonNullable<ReturnType<typeof useAuth>['user']>;
  onLogout: () => Promise<void>;
}) {
  const [currentPage, setCurrentPage] = useState<PageNavigation>('goals');
  const { goals } = useGoalData();
  const completedGoalCount = goals.filter((goal) => goal.completed).length;

  return (
    <div className="bg-base-100 min-h-screen px-8">
      <SiteHeader user={user} onLogout={() => void onLogout()} onNavigate={setCurrentPage} />
      {currentPage === 'account' ? (
        <AccountPage
          email={user.email}
          goalCount={goals.length}
          completedGoalCount={completedGoalCount}
          onBack={() => setCurrentPage('goals')}
        />
      ) : (
        <DashboardPage />
      )}
    </div>
  );
}

export default App;