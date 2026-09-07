import { useState, useEffect } from "react";
import GoalForm from "./components/GoalForm";
import { Task } from "./types/goalget";
import { DAYS_MAP } from "./types/goalGrap"; // Import de la constante DAYS_MAP pour l'utiliser dans le composant
import GoalGet from "./components/GoalGet";
import GoalGraph from "./components/GoalGraph";
import { Toaster, toast } from 'sonner';
import { GoalGraphData } from "./types/goalGrap"; // Import de l'interface pour typer les données du graphe 



function App() {
  const [goals, setGoals] = useState<Task[]>([]);
  const [graphData, setGraphData] = useState<GoalGraphData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadGraphData = async () => {
    try {
      setLoading(true);
      const [resTotal, resCompleted] = await Promise.all([
        fetch('http://localhost:5000/api/goals/graph'),
        fetch('http://localhost:5000/api/goals/graph/completed')
      ]);

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
      console.error("Erreur lors de la récupération des données graphiques:", error);
    } finally {
      setLoading(false);
    }
  };

  // 1. Charger les goals existants au démarrage
  useEffect(() => {
    const loadGoals = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/goals');
        if (response.ok) {
          const data = await response.json();
          setGoals(data);
        }
      } catch (error) {
        toast.error("Impossible de charger les données");
      }
    };
    loadGoals();
  }, []);

  // 2. Mettre à jour la liste quand un nouveau goal est ajouté
  const handleAddGoal = (newGoal: Task) => {
    setGoals((prevGoals) => [newGoal, ...prevGoals]);
    void loadGraphData();
  };

  const handleToggleGoal = async (id: number, completed: boolean) => {
    try {
      const response = await fetch(`http://localhost:5000/api/goals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      });

      if (response.ok) {
        const updatedGoal = await response.json();

        setGoals(prevGoals => prevGoals.map(g => g.id === id ? updatedGoal : g));

        if (completed) {
          toast.success("Objectif validé ! 🗿");
        }

        await loadGraphData();
      }
    } catch (error) {
      toast.error("Erreur de connexion au serveur");
    }
  };

  const handleDeleteGoal = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/goals/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setGoals(prevGoals => prevGoals.filter((goal) => goal.id !== id));
        toast.success("Objectif supprimé !");
        await loadGraphData();
      } else {
        toast.error("Impossible de supprimer cet objectif");
      }
    } catch (error) {
      toast.error("Erreur de connexion au serveur");
    }
  };

  useEffect(() => {
    loadGraphData();
  }, []);

  return (
    <div className="bg-base-100 p-10 min-h-screen flex flex-col items-center">
      <h1 className="text-4xl font-black text-primary italic mb-10">DAILY GOAL TRACKER</h1>

      {/* Conteneur principal qui contient TOUT le contenu sous le titre */}
      <div className="flex flex-col w-full gap-8 w-[75vw] mx-auto">

        {/* 1. SECTION DU HAUT : Graphe + Formulaire côte-à-côte */}
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

          {/* Formulaire à droite du graphe */}
          <div className="w-96 h-full">
            <GoalForm onAddGoal={handleAddGoal} />
          </div>
        </div>

        {/* 2. SECTION DU BAS : Liste des objectifs (tableau jour-par-jour) */}
        <div className="w-full h-[50vh]">
          <GoalGet goals={goals} onToggle={handleToggleGoal} onDelete={handleDeleteGoal} />
        </div>
      </div>
    </div>
  );
}

export default App;