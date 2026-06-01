/**
 * @file GoalGet.tsx
 * @description Composant React pour afficher la liste des objectifs (goals) de l'utilisateur. 
 * Chaque objectif est affiché dans une carte avec son texte, sa priorité, sa date de création et une case à cocher pour marquer l'objectif comme complété.
 * Le composant reçoit une liste d'objectifs et une fonction de rappel pour gérer le changement d'état de complétion d'un objectif. 
 * Si la liste est vide, un message invitant l'utilisateur à ajouter des objectifs est affiché.
 * @version 1.0
 * @author Sooz (Sam)
 * @date 2026-03-02
 * @license MIT
 */

import { Task } from "../types/goalget";

interface GoalGetProps {
  goals: Task[];
  onToggle: (id: number, completed: boolean) => void;
}

export default function GoalGet({ goals, onToggle }: GoalGetProps) {
  if (goals.length === 0) {
    return (
      <div className="text-center p-10 bg-base-200 rounded-xl border-base-300 h-full flex flex-col items-center justify-center">
        <p className="text-gray-500 italic">Aucun objectif pour le moment. Deviens un Sigma ! 🗿</p>
      </div>
    );
  }

  return (
    <div className="bg-base-200 p-6 rounded-2xl shadow-lg flex flex-col gap-4 h-full overflow-y-auto pr-10">
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
              <input
                  type="checkbox"
                  checked={goal.completed}
                  className="checkbox checkbox-primary relativev z-20"
                  onChange={() => {
                    console.log("Input cliqué !");
                    onToggle(goal.id, !goal.completed)
                  }}
                />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}