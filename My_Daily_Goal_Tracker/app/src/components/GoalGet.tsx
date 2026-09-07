/**
 * Composant GoalGet : Affiche la liste des objectifs de l'utilisateur
 * Chaque objectif affiche son texte, sa priorité (avec un badge coloré) et une case à cocher pour marquer comme terminé.
 * Lorsque l'utilisateur coche ou décoche la case, une requête PATCH est envoyée au backend pour mettre à jour le statut de l'objectif.
 */
import { Task } from "../types/goalget";
import React, { useState, useEffect } from "react";
import { DAYS_MAP } from "../types/goalGrap";

interface GoalGetProps {
  goals: Task[];
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
}

export default function GoalGet({ goals, onToggle, onDelete }: GoalGetProps) {
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

  const DAYS_ORDER = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI', 'DIMANCHE'];

  const grouped: Record<string, Task[]> = {};
  DAYS_ORDER.forEach(d => (grouped[d] = []));
  goals.forEach(g => {
    const day = g.day || 'LUNDI';
    if (!grouped[day]) grouped[day] = [];
    grouped[day].push(g);
  });

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

  return (
    <div className="bg-base-200 p-6 rounded-2xl shadow-lg h-full overflow-auto">
      <h2 className="text-xl font-bold text-primary text-center mb-4">Mes Objectifs</h2>

      <div className="overflow-x-auto h-full">
        <table className="table table-compact w-full">
          <thead>
            <tr>
              {DAYS_ORDER.map((d) => (
                <th key={d} className="text-center">{capitalize(d)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {DAYS_ORDER.map((d) => (
                <td key={d} className="align-top py-4">
                  <div className="flex flex-col gap-3">
                    {(grouped[d] || []).length === 0 ? (
                      <div className="text-sm text-gray-400 italic">Aucun</div>
                    ) : (
                      (grouped[d] || []).map((goal) => {
                        const isOpen = openId === goal.id;

                        return (
                          <div
                            key={goal.id}
                            className={`card bg-base-100 shadow-sm border border-base-300 p-3 ${isOpen ? 'mb-14' : ''}`}
                            onClick={() => setOpenId(isOpen ? null : goal.id)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpenId(isOpen ? null : goal.id); }}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <div className="font-medium">{goal.text}</div>
                                <div className="text-xs text-gray-400">{new Date(goal.createdAt).toLocaleDateString()}</div>
                              </div>

                              <div className="flex flex-col items-end gap-2">
                                <div className={`badge ${goal.priority === 'Sigma' ? 'badge-primary' : goal.priority === 'Indispensable' ? 'badge-error' : 'badge-ghost'}`}>{goal.priority}</div>
                                <input
                                  type="checkbox"
                                  checked={goal.completed}
                                  className="checkbox checkbox-sm checkbox-primary"
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={() => onToggle(goal.id, !goal.completed)}
                                />
                              </div>
                            </div>

                            <div
                              className={`absolute left-0 top-full mt-2 w-full bg-base-100 rounded-lg shadow-lg z-30 transform transition duration-200 ease-out origin-top-right ${isOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-2 scale-95 pointer-events-none"}`}
                              aria-hidden={!isOpen}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex flex-row justify-between items-center gap-2 p-2 w-full rounded-2xl shadow-md">

                                <button
                                  className="flex-1 relative overflow-hidden text-red-500 font-medium bg-transparent px-4 py-2 rounded-xl transition-all duration-300 ease-in-out hover:text-white hover:bg-red-600 active:scale-95 whitespace-nowrap"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(goal.id);
                                  }}
                                >
                                  Supprimer
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}