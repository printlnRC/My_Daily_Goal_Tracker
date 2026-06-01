import { useState, useEffect } from "react";
import GoalForm from "./components/GoalForm";
import { Task } from "./types/goalget";
import GoalGet from "./components/GoalGet";
import GoalGraph from "./components/GoalGraph";
import { Toaster, toast } from 'sonner';
import { GoalGraphData } from "./types/goalGrap"; // Import de l'interface pour typer les données du graphe 

const DAYS_MAP: { [key: string]: { order: number; label: string } } = {
  LUNDI: { order: 1, label: 'Lun' },
  MARDI: { order: 2, label: 'Mar' },
  MERCREDI: { order: 3, label: 'Mer' },
  JEUDI: { order: 4, label: 'Jeu' },
  VENDREDI: { order: 5, label: 'Ven' },
  SAMEDI: { order: 6, label: 'Sam' },
  DIMANCHE: { order: 7, label: 'Dim' }
};

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

        // On met à jour l'état local pour que React redessine la liste
        setGoals(goals.map(g => g.id === id ? updatedGoal : g));

        if (completed) {
          toast.success("Objectif validé ! 🗿");
        }

        await loadGraphData();
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
    <div className="flex flex-col w-full gap-8 max-w-6xl">
      
      {/* 1. SECTION DU HAUT : Le Graphe (Prend toute la largeur) */}
      <div className="w-full h-[35vh]">
          {loading ? (
            <div className="bg-base-300 h-full rounded-2xl flex items-center justify-center animate-pulse">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : (
            <GoalGraph graphData={graphData} />
          )}
        </div>

      {/* 2. SECTION DU BAS : Grille pour les deux blocs d'action */}
      <div className="flex w-full gap-8 h-[50vh]">
        
        {/* Bloc de Gauche (Liste) */}
        <div className="flex-1 overflow-y-auto">
          <GoalGet goals={goals} onToggle={handleToggleGoal} />
        </div>

        {/* Bloc de Droite (Formulaire) */}
        <div className="flex-1">
          <GoalForm onAddGoal={handleAddGoal} />
        </div>

      </div>
    </div>
  </div>
);
}

export default App;