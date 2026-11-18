/**
 * @file GoalGet.tsx
 * @description Affiche les objectifs par jour et permet de les terminer ou de les supprimer.
 * @author Copilot
 * @date 2026-11-18
 * @version 1.0.0
 * @license MIT
 */

import { useEffect, useState } from 'react';
import PriorityBadge from '../../../components/ui/PriorityBadge';
import type { Goal } from '../types/goal.types';

interface GoalGetProps {
  goals: Goal[];
  onToggle: (id: number, completed: boolean) => Promise<unknown>;
  onDelete: (id: number) => Promise<void>;
}

const DAYS_ORDER = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI', 'DIMANCHE'] as const;

export default function GoalGet({ goals, onToggle, onDelete }: GoalGetProps) {
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpenId(null);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (goals.length === 0) {
    return (
      <div className="text-center p-10 bg-base-200 rounded-xl border-base-300 h-full flex flex-col items-center justify-center">
        <p className="text-gray-500 italic">Aucun objectif pour le moment. Deviens un Sigma ! 🗿</p>
      </div>
    );
  }

  const grouped: Record<string, Goal[]> = {};
  DAYS_ORDER.forEach((day) => { grouped[day] = []; });
  goals.forEach((goal) => {
    if (!grouped[goal.day]) grouped[goal.day] = [];
    grouped[goal.day].push(goal);
  });

  const capitalize = (day: string) => day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();

  return (
    <div className="bg-base-200 p-6 rounded-2xl shadow-lg h-full flex flex-col">
      <h2 className="text-xl font-bold text-primary text-center mb-4 shrink-0">Mes Objectifs</h2>
      <div className="overflow-x-auto flex-1">
        <table className="table table-compact w-full table-fixed">
          <thead className="sticky top-0 z-20 bg-base-200">
            <tr>
              {DAYS_ORDER.map((day) => (
                <th key={day} className="text-center bg-base-200 py-3">{capitalize(day)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {DAYS_ORDER.map((day) => (
                <td key={day} className="align-top p-2">
                  <div className="flex flex-col gap-3 max-h-[38vh] overflow-y-auto pr-1">
                    {(grouped[day] || []).length === 0 ? (
                      <div className="text-sm text-gray-400 italic text-center py-2">Aucun</div>
                    ) : (
                      grouped[day].map((goal) => {
                        const isOpen = openId === goal.id;
                        return (
                          <div
                            key={goal.id}
                            className={`relative card bg-base-100 shadow-sm border border-base-300 p-3 shrink-0 ${isOpen ? 'mb-14' : ''}`}
                            onClick={() => setOpenId(isOpen ? null : goal.id)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter' || event.key === ' ') setOpenId(isOpen ? null : goal.id);
                            }}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <div className="font-medium text-sm">{goal.text}</div>
                                <div className="text-xs text-gray-400">
                                  {new Date(goal.createdAt).toLocaleDateString()}
                                </div>
                                <PriorityBadge priority={goal.priority} />
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <input
                                  type="checkbox"
                                  checked={goal.completed}
                                  className="checkbox checkbox-md checkbox-primary"
                                  onClick={(event) => event.stopPropagation()}
                                  onChange={() => {
                                    void onToggle(goal.id, !goal.completed).catch((error: unknown) => {
                                      console.error('Erreur lors de la mise à jour de l’objectif :', error);
                                    });
                                  }}
                                />
                              </div>
                            </div>
                            <div
                              className={`absolute left-0 top-full mt-2 w-full bg-base-100 rounded-lg shadow-lg z-30 transform transition duration-200 ease-out origin-top-right ${isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'}`}
                              aria-hidden={!isOpen}
                              onClick={(event) => event.stopPropagation()}
                            >
                              <div className="flex flex-row justify-between items-center gap-2 p-2 w-full rounded-2xl shadow-md">
                                <button
                                  className="flex-1 relative overflow-hidden text-red-500 font-medium bg-transparent px-4 py-2 rounded-xl transition-all duration-300 ease-in-out hover:text-white hover:bg-red-600 active:scale-95 whitespace-nowrap"
                                  onClick={() => {
                                    void onDelete(goal.id).catch((error: unknown) => {
                                      console.error('Erreur lors de la suppression de l’objectif :', error);
                                    });
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
