/**
 * @file DashboardPage.tsx
 * @description Assemble le graphique, le formulaire et le tableau hebdomadaire des objectifs.
 * @author Copilot
 * @date 2026-11-18
 * @version 1.0.0
 * @license MIT
 */

import { toast } from 'sonner';
import { ApiError } from '../lib/apiClient';
import GoalForm from '../features/goals/components/GoalForm';
import GoalGet from '../features/goals/components/GoalGet';
import GoalGraph from '../features/goals/components/GoalGraph';
import { useGoalData } from '../features/goals/context/GoalsContext';

export default function DashboardPage() {
  const {
    goals,
    loading,
    addGoals,
    toggleGoal,
    deleteGoal,
    graphData,
    priorityFilter,
    setPriorityFilter,
  } = useGoalData();

  const handleToggleGoal = async (id: number, completed: boolean) => {
    try {
      await toggleGoal(id, completed);
      if (completed) toast.success('Objectif validé ! 🗿');
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) return;
      console.error('Erreur lors de la mise à jour de l’objectif :', error);
      toast.error('Erreur de connexion au serveur');
    }
  };

  const handleDeleteGoal = async (id: number) => {
    try {
      await deleteGoal(id);
      toast.success('Objectif supprimé !');
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) return;
      console.error('Erreur lors de la suppression de l’objectif :', error);
      toast.error(error instanceof Error ? error.message : 'Impossible de supprimer cet objectif');
    }
  };

  return (
    <main className="flex flex-col w-full gap-8 w-[75vw] mx-auto">
      <section className="w-full h-[35vh] flex gap-8">
        <div className="flex-2 h-full min-w-0">
          {loading ? (
            <div className="bg-base-300 h-full rounded-2xl flex items-center justify-center animate-pulse">
              <span className="loading loading-spinner loading-lg text-primary" />
            </div>
          ) : (
            <GoalGraph
              graphData={graphData}
              priorityFilter={priorityFilter}
              onPriorityFilterChange={setPriorityFilter}
            />
          )}
        </div>
        <div className="w-96 h-full shrink-0">
          <GoalForm onAddGoal={addGoals} />
        </div>
      </section>

      <section className="w-full h-[50vh]">
        <GoalGet goals={goals} onToggle={handleToggleGoal} onDelete={handleDeleteGoal} />
      </section>
    </main>
  );
}
