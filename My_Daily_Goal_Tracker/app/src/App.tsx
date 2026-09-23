import { useState, useEffect, type FormEvent } from "react";
import GoalForm from "./components/GoalForm";
import { Task } from "./types/goalget";
import { DAYS_MAP } from "./types/goalGrap";
import GoalGet from "./components/GoalGet";
import GoalGraph from "./components/GoalGraph";
import { toast } from 'sonner';
import { GoalGraphData } from "./types/goalGrap";

const API_BASE = 'http://localhost:5000';

type AuthUser = {
  id: number;
  email: string;
};

function App() {
  const [goals, setGoals] = useState<Task[]>([]);
  const [graphData, setGraphData] = useState<GoalGraphData[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('daily-goal-token'));
  const [user, setUser] = useState<AuthUser | null>(() => {
    const rawUser = localStorage.getItem('daily-goal-user');
    return rawUser ? JSON.parse(rawUser) : null;
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAuthenticated = Boolean(token);

  const getAuthHeaders = (extraHeaders: Record<string, string> = {}) => ({
    ...extraHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  });

  const handleLogout = () => {
    localStorage.removeItem('daily-goal-token');
    localStorage.removeItem('daily-goal-user');
    setToken(null);
    setUser(null);
    setEmail('');
    setPassword('');
    setLoginError('');
  };

  const loadGraphData = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const [resTotal, resCompleted] = await Promise.all([
        fetch(`${API_BASE}/api/goals/graph`, {
          headers: getAuthHeaders(),
        }),
        fetch(`${API_BASE}/api/goals/graph/completed`, {
          headers: getAuthHeaders(),
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
    if (!token) return;

    const loadGoals = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/goals`, {
          headers: getAuthHeaders(),
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
  }, [token]);

  const handleAddGoal = (newGoal: Task) => {
    setGoals((prevGoals) => [newGoal, ...prevGoals]);
    void loadGraphData();
  };

  const handleToggleGoal = async (id: number, completed: boolean) => {
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE}/api/goals/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
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
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE}/api/goals/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
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

    if (!email.trim() || !password.trim()) {
      setLoginError('Veuillez remplir email et mot de passe.');
      return;
    }

    try {
      setIsSubmitting(true);
      setLoginError('');

      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Identifiants invalides.');
      }

      localStorage.setItem('daily-goal-token', data.token);
      localStorage.setItem('daily-goal-user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setEmail('');
      setPassword('');
    } catch (error: any) {
      setLoginError(error.message || 'Erreur lors de la connexion.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
        <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-300">
          <div className="card-body">
            <div className="text-center mb-6">
              <p className="text-sm uppercase tracking-[0.3em] text-primary">Daily Goal Tracker</p>
              <h1 className="text-3xl font-black mt-2">Connexion</h1>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <label className="form-control w-full">
                <span className="label-text mb-2">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input input-bordered w-full"
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
                  className="input input-bordered w-full"
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
      <div className="flex items-center justify-between mb-3">
        <div>
          <h1 className="text-4xl font-black text-primary italic">DAILY GOAL TRACKER</h1>
          {user && <p className="text-sm text-base-content/70 mt-1">Connecté en tant que {user.email}</p>}
        </div>
        <button className="btn btn-outline btn-sm" onClick={handleLogout}>
          Déconnexion
        </button>
      </div>

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
    </div>
  );
}

export default App;