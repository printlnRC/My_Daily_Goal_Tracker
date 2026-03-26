import { useState, useEffect } from "react";
import GoalForm, { Task } from "./components/GoalForm";
import GoalGet from "./components/GoalGet"; // Import sans le { Task } pour éviter le conflit
import GoalGraph from "./components/GoalGraph";
import { Toaster, toast } from 'sonner';

function App() {
  const [goals, setGoals] = useState<Task[]>([]);

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
      }
    } catch (error) {
      toast.error("Erreur de connexion au serveur");
    }
  };

return (
  <div className="bg-base-100 p-10 min-h-screen flex flex-col items-center">
    <h1 className="text-4xl font-black text-primary italic mb-10">DAILY GOAL TRACKER</h1>

    {/* Conteneur principal qui contient TOUT le contenu sous le titre */}
    <div className="flex flex-col w-full gap-8 max-w-6xl">
      
      {/* 1. SECTION DU HAUT : Le Graphe (Prend toute la largeur) */}
      <div className="w-full h-[30vh]">
        <div className="bg-base-300 h-full rounded-2xl shadow-lg flex items-center justify-center">
          <h2 className="text-2xl font-bold text-secondary">Graphe des Objectifs Validés (Bientôt...)</h2>
          <GoalGraph />
        </div>
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