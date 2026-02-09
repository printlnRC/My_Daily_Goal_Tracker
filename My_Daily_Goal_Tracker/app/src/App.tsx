import { useState, useEffect } from "react";
import GoalForm, { Task } from "./components/GoalForm";
import GoalGet from "./components/GoalGet"; // Import sans le { Task } pour éviter le conflit
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
    <div className="min-h-screen bg-base-100 p-5 fle">
      <Toaster richColors position="top-right" />

      <div className="w-full">
        <h1 className="text-4xl font-black text-center text-primary italic mb-8">DAILY GOAL TRACKER</h1>

        <div className="flex gap-8">
          {/* LISTE DES GOALS */}
          <div className="w-1/2">
            <GoalGet goals={goals} onToggle={handleToggleGoal} />
          </div>

          {/* FORMULAIRE */}
          <div className="w-1/2">
            <GoalForm onAddGoal={handleAddGoal} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;