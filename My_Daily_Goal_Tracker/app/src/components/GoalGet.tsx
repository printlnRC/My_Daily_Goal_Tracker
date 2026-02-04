// src/components/GoalGet.tsx

// On définit l'interface ici si tu n'as pas de fichier de types partagé
export interface Task {
  id: number;
  text: string;
  priority: string;
  completed: boolean;
  createdAt: string;
}

interface GoalGetProps {
  goals: Task[];
}

export default function GoalGet({ goals }: GoalGetProps) {
  if (goals.length === 0) {
    return (
      <div className="text-center p-10 bg-base-200 rounded-xl border-2 border-dashed border-base-300">
        <p className="text-gray-500 italic">Aucun objectif pour le moment. Deviens un Sigma ! 🗿</p>
      </div>
    );
  }

  return (
    <div className="bg-base-200 p-6 rounded-2xl shadow-lg flex flex-col gap-4 h-1/2">
      <h2 className="text-xl font-bold text-primary text-center">Mes Objectif</h2>
      {goals.map((goal) => (
        <div key={goal.id} className="card bg-base-100 shadow-md border border-base-300 hover:shadow-lg transition-shadow">
          <div className="card-body p-4 flex-row items-center justify-between">
            <div className="flex flex-col">
              <span className="text-lg font-medium">{goal.text}</span>
              <span className="text-xs text-gray-400">
                Ajouté le {new Date(goal.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Badge de priorité avec des couleurs dynamiques */}
              <div className={`badge badge-lg font-bold ${goal.priority === 'Sigma' ? 'badge-primary' :
                  goal.priority === 'Indispensable' ? 'badge-error' : 'badge-ghost'
                }`}>
                {goal.priority === 'Sigma' ? '🗿 ' :
                  goal.priority === 'Indispensable' ? '🔥 ' : '😎 '}
                {goal.priority}
              </div>

              <input type="checkbox" checked={goal.completed} className="checkbox checkbox-primary" readOnly />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}