/**
 * Composant GoalGet : Affiche la liste des objectifs de l'utilisateur
 * Chaque objectif affiche son texte, sa priorité (avec un badge coloré) et une case à cocher pour marquer comme terminé.
 * Lorsque l'utilisateur coche ou décoche la case, une requête PATCH est envoyée au backend pour mettre à jour le statut de l'objectif,
 */
// On définit l'interface ici si tu n'as pas de fichier de types partagé
import { Task } from "../types/goalget"; // Import de l'interface Task pour typer les props
import React, { useState, useEffect } from "react";

interface GoalGetProps {
  goals: Task[];
  onToggle: (id: number, completed: boolean) => void;
}

export default function GoalGet({ goals, onToggle }: GoalGetProps) {
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenId(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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
      {goals.map((goal) => {
        const isOpen = openId === goal.id;
        return (
          <div
            key={goal.id}
            className="card bg-base-100 shadow-md border border-base-300 hover:shadow-lg transition-shadow relative cursor-pointer"
            onClick={() => setOpenId(isOpen ? null : goal.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setOpenId(isOpen ? null : goal.id);
            }}
          >
            <div className="card-body p-4 flex-row items-center justify-between">
              <div className="flex flex-col">
                <span className="text-lg font-medium">{goal.text}</span>
                <span className="text-xs text-gray-400">
                  Ajouté le {new Date(goal.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Badge de priorité avec des couleurs dynamiques */}
                <div
                  className={`badge badge-lg font-bold ${goal.priority === "Sigma" ? "badge-primary" : goal.priority === "Indispensable" ? "badge-error" : "badge-ghost"
                    }`}
                >
                  {goal.priority === "Sigma" ? "🗿 " : goal.priority === "Indispensable" ? "🔥 " : "😎 "}
                  {goal.priority}
                </div>
                <input
                  type="checkbox"
                  checked={goal.completed}
                  className="checkbox checkbox-primary z-20"
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => {
                    console.log("Input cliqué !");
                    onToggle(goal.id, !goal.completed);
                  }}
                />
              </div>
            </div>

            {/* Menu animé: rectangle full-width juste sous la carte */}
            <div
              className={`absolute left-0 top-full mt-2 w-full bg-base-100 border rounded-lg shadow-lg z-30 transform transition duration-200 ease-out origin-top-right ${isOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
                }`}
              aria-hidden={!isOpen}
              onClick={(e) => e.stopPropagation()}
            >


              <div className="flex flex-row justify-between items-center gap-2 p-2 w-full bg-base-300 rounded-2xl shadow-md">

                {/* Bouton Modifier : prend 1/3 de l'espace et utilise ton vert exact */}
                <button className="flex-1 text-center px-4 py-2 rounded-xl text-[#27bd3b] hover:bg-base-100 transition-colors duration-200 font-medium">
                  Modifier
                </button>

                {/* Bouton Dupliquer : prend 1/3 de l'espace */}
                <button className="flex-1 text-center px-4 py-2 rounded-xl hover:bg-base-100 transition-colors duration-200 font-medium">
                  Dupliquer
                </button>

                {/* Bouton Supprimer : prend 1/3 de l'espace, ne se fait plus écraser */}
                <button className="flex-1 relative overflow-hidden border border-red-600 text-red-500 font-medium bg-transparent px-4 py-2 rounded-xl transition-all duration-300 ease-in-out hover:text-white hover:bg-red-600 active:scale-95 whitespace-nowrap">
                  Supprimer
                </button>

              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}