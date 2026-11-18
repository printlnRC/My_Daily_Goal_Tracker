/**
 * @file App.tsx
 * @description Gère l’authentification, les objectifs et les vues principales de l’application.
 * @author Copilot
 * @date 2026-11-17
 * @version 1.0.0
 * @license MIT
 */

import { useState, useEffect, type FormEvent } from "react";
import GoalForm from "./components/GoalForm";
import AccountPage from "./components/AccountPage";
import { Task } from "./types/goalget";
import { DAYS_MAP } from "./types/goalGrap";
import GoalGet from "./components/GoalGet";
import GoalGraph from "./components/GoalGraph";
import SiteHeader, { type PageNavigation } from "./components/Header";
import { toast } from 'sonner';
import { GoalGraphData } from "./types/goalGrap";
import { loginSchema } from './lib/schemas';

const API_BASE = '/api';

type AuthUser = {
  id: number;
  email: string;
};

function App() {
  const [currentPage, setCurrentPage] = useState<PageNavigation>('goals');
  const [goals, setGoals] = useState<Task[]>([]);
  const [graphData, setGraphData] = useState<GoalGraphData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAuthenticated = Boolean(user);

  const handleLogout = () => {
    localStorage.removeItem('daily-goal-token');
    localStorage.removeItem('daily-goal-user');
    setUser(null);
    setGoals([]);
    setGraphData([]);
    setCurrentPage('goals');
    setEmail('');
    setPassword('');
    setLoginError('');

    void fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    }).then((response) => {
      if (!response.ok) {
        throw new Error('Le serveur n’a pas pu fermer la session.');
      }
    }).catch((error: unknown) => {
      console.error('Erreur lors de la déconnexion :', error);
      toast.error('Impossible de fermer la session sur le serveur.');
    });
  };

  useEffect(() => {
    let isActive = true;
    localStorage.removeItem('daily-goal-token');
    localStorage.removeItem('daily-goal-user');

    const restoreSession = async () => {
      try {
        const response = await fetch(`${API_BASE}/auth/me`, {
          credentials: 'include',
        });

        if (response.ok) {
          const data: { user: AuthUser } = await response.json();
          if (isActive) setUser(data.user);
        } else if (response.status !== 401 && response.status !== 403) {
          throw new Error(
            `L’API a répondu avec le statut ${response.status}. Vérifie que le serveur fonctionne dans le dossier server.`,
          );
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de la session :', error);
        if (isActive) {
          toast.error(
            error instanceof TypeError
              ? 'API injoignable. Démarre le serveur avec « npm run dev » dans le dossier server.'
              : error instanceof Error
                ? error.message
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
  }, []);

  const loadGraphData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [resTotal, resCompleted] = await Promise.all([
        fetch(`${API_BASE}/goals/graph`, {
          credentials: 'include',
        }),
        fetch(`${API_BASE}/goals/graph/completed`, {
          credentials: 'include',
        }),
      ]);

      if (resTotal.status === 401 || resTotal.status === 403 || resCompleted.status === 401 || resCompleted.status === 403) {
        handleLogout();
        toast.error('Session expirée. Veuillez vous reconnecter.');
        return;
      }

      const totals = await resTotal.json();
      const completeds = await resCompleted.json();

      const weeklyData: { [key: string]: { day: string; qty: number; completed: number; order: number } } = {};
      Object.keys(DAYS_MAP).forEach((key) => {
        weeklyData[key] = {
          day: DAYS_MAP[key].label,
          qty: 0,
          completed: 0,
          order: DAYS_MAP[key].order
        };
      });

      totals.forEach((item: any) => {
        if (weeklyData[item.day]) {
          weeklyData[item.day].qty = item._count.day;
        }
      });

      completeds.forEach((item: any) => {
        if (weeklyData[item.day]) {
          weeklyData[item.day].completed = item._count.day;
        }
      });

      const formattedData = Object.values(weeklyData).sort((a, b) => a.order - b.order);
      setGraphData(formattedData);
    } catch (error) {
      console.error('Erreur lors de la récupération des données graphiques:', error);
      toast.error('Impossible de charger le graphique');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    const loadGoals = async () => {
      try {
        const response = await fetch(`${API_BASE}/goals`, {
          credentials: 'include',
        });

        if (response.status === 401 || response.status === 403) {
          handleLogout();
          toast.error('Session expirée. Veuillez vous reconnecter.');
          return;
        }

        if (response.ok) {
          const data = await response.json();
          setGoals(data);
        }
      } catch (error) {
        toast.error('Impossible de charger les données');
      }
    };

    void loadGoals();
    void loadGraphData();
  }, [user]);

  const handleAddGoal = (newGoals: Task[]) => {
    setGoals((prevGoals) => [...newGoals, ...prevGoals]);
    void loadGraphData();
  };

  const handleToggleGoal = async (id: number, completed: boolean) => {
    if (!user) return;

    try {
      const response = await fetch(`${API_BASE}/goals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ completed }),
      });

      if (response.status === 401 || response.status === 403) {
        handleLogout();
        toast.error('Session expirée. Veuillez vous reconnecter.');
        return;
      }

      if (response.ok) {
        const updatedGoal = await response.json();
        setGoals(prevGoals => prevGoals.map(g => g.id === id ? updatedGoal : g));

        if (completed) {
          toast.success('Objectif validé ! 🗿');
        }

        await loadGraphData();
      }
    } catch (error) {
      toast.error('Erreur de connexion au serveur');
    }
  };

  const handleDeleteGoal = async (id: number) => {
    if (!user) return;

    try {
      const response = await fetch(`${API_BASE}/goals/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.status === 401 || response.status === 403) {
        handleLogout();
        toast.error('Session expirée. Veuillez vous reconnecter.');
        return;
      }

      if (response.ok) {
        setGoals(prevGoals => prevGoals.filter((goal) => goal.id !== id));
        toast.success('Objectif supprimé !');
        await loadGraphData();
      } else {
        toast.error('Impossible de supprimer cet objectif');
      }
    } catch (error) {
      toast.error('Erreur de connexion au serveur');
    }
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsed = loginSchema.safeParse({ email, password });

    if (!parsed.success) {
      setLoginError(parsed.error.issues[0].message);
      return;
    }

    try {
      setIsSubmitting(true);
      setLoginError('');

      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(parsed.data),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type') ?? '';
        const errorData: { error?: string } = contentType.includes('application/json')
          ? await response.json()
          : {};
        throw new Error(
          errorData.error
            || `Erreur API (HTTP ${response.status}). Vérifie le terminal du serveur.`,
        );
      }

      const data: { user: AuthUser } = await response.json();
      setUser(data.user);
      setEmail('');
      setPassword('');
    } catch (error: any) {
      setLoginError(
        error instanceof TypeError
          ? 'API injoignable. Démarre le serveur avec « npm run dev » dans le dossier server.'
          : error.message || 'Erreur lors de la connexion.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const completedGoalCount = goals.filter((goal) => goal.completed).length;

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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
        <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-300">
          <div className="card-body">
            <div className="text-center mb-6">
              <p className="text-sm uppercase tracking-[0.3em] text-primary">Daily Goal Tracker</p>
              <h1 className="text-3xl font-black mt-2">Connexion</h1>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <label className="form-control w-full">
                <span className="label-text mb-2">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value)}
                  className="input input-bordered w-full focus:outline-none focus:ring-0 focus:border-primary"
                  placeholder="••••••••"
                  disabled={isSubmitting}
                />
              </label>

              {loginError && (
                <div className="alert alert-error text-sm py-2">{loginError}</div>
              )}

              <button type="submit" className="btn btn-primary w-full mt-2" disabled={isSubmitting}>
                {isSubmitting ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-100 min-h-screen px-8">
      <SiteHeader
        user={user}
        onLogout={handleLogout}
        onNavigate={setCurrentPage}
      />

      {currentPage === 'account' ? (
        <AccountPage
          email={user?.email}
          goalCount={goals.length}
          completedGoalCount={completedGoalCount}
          onBack={() => setCurrentPage('goals')}
        />
      ) : (
        <div className="flex flex-col w-full gap-8 w-[75vw] mx-auto">
          <div className="w-full h-[35vh] flex gap-8">
            <div className="flex-2 h-full">
              {loading ? (
                <div className="bg-base-300 h-full rounded-2xl flex items-center justify-center animate-pulse">
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
              ) : (
                <GoalGraph graphData={graphData} />
              )}
            </div>

            <div className="w-96 h-full">
              <GoalForm onAddGoal={handleAddGoal} />
            </div>
          </div>

          <div className="w-full h-[50vh]">
            <GoalGet goals={goals} onToggle={handleToggleGoal} onDelete={handleDeleteGoal} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;