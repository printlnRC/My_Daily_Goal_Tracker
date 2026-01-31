import { useState } from "react";
import GoalForm, { Task } from "./components/GoalForm";

function App() {
  const [goals, setGoals] = useState<Task[]>([]);

  // La seule fonction de gestion ici : ajouter l'objet reçu à la liste
  const handleAddGoal = (newGoal: Task) => {
    setGoals([newGoal, ...goals]);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-5">
      <div className="w-12/13 my-10">
        {/* On appelle le composant et on lui passe la fonction de gestion */}
        <GoalForm onAddGoal={handleAddGoal} />
        
        {/* Ici tu pourras plus tard mapper tes goals pour les afficher */}
        <div className="mt-5">
          {goals.map((g) => (
            <div key={g.id} className="p-2 border-b">
               {g.text} - <span className="badge">{g.priority}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;