/**
 * @file GoalForm.tsx
 * @description Affiche le formulaire de création et de validation d’un objectif.
 * @author Copilot
 * @date 2026-11-18
 * @version 1.0.0
 * @license MIT
 */

import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { ApiError } from '../../../lib/apiClient';
import { goalSchema } from '../schemas/goal.schemas';
import type { GoalDay, GoalPriority } from '../types/goal.types';
import type { CreateGoalInput } from '../services/goalService';

type GoalFormProps = {
  onAddGoal: (input: CreateGoalInput) => Promise<unknown>;
};

export default function GoalForm({ onAddGoal }: GoalFormProps) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<GoalPriority>('Sigma');
  const [days, setDays] = useState<GoalDay[]>(['LUNDI']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = goalSchema.safeParse({ text, priority, days });
    if (!payload.success) {
      toast.error(payload.error.issues[0].message);
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddGoal(payload.data);
      toast.success('Objectif ajouté au registre, Sigma ! 🗿');
      setText('');
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) return;
      console.error('Erreur lors de la création de l’objectif :', error);
      toast.error(error instanceof Error ? error.message : 'Impossible de créer cet objectif.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleDay = (day: GoalDay) => {
    setDays((selectedDays) => selectedDays.includes(day)
      ? selectedDays.filter((selectedDay) => selectedDay !== day)
      : [...selectedDays, day]);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-base-200 p-4 rounded-2xl shadow-lg flex flex-col gap-2 h-full">
      <h2 className="text-xl font-bold text-primary text-center">Nouvel Objectif</h2>

      <div className="form-control">
        <input
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Ex: Maîtriser Docker..."
          className="input input-bordered w-full focus:input-primary"
        />
      </div>

      <div className="flex gap-2">
        <select
          className="select select-bordered select-sm flex-1"
          value={priority}
          onChange={(event) => setPriority(event.target.value as GoalPriority)}
        >
          <option value="Sigma">🗿 Sigma</option>
          <option value="Indispensable">🔥 Indispensable</option>
          <option value="Cool">😎 Cool</option>
        </select>
      </div>

      <fieldset className="min-h-0">
        <legend className="label-text mb-1">Jours</legend>
        <div className="grid grid-cols-4 gap-1">
          {(['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI', 'DIMANCHE'] as const).map((day) => (
            <label key={day} className="flex cursor-pointer items-center gap-1 text-xs">
              <input
                type="checkbox"
                className="checkbox checkbox-primary checkbox-xs"
                checked={days.includes(day)}
                onChange={() => toggleDay(day)}
              />
              <span>{day.slice(0, 3)}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <button type="submit" className="btn btn-primary btn-sm mt-auto shadow-md" disabled={isSubmitting}>
        {isSubmitting ? 'Ajout...' : 'Ajouter'}
      </button>
    </form>
  );
}
