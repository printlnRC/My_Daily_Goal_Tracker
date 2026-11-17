/**
 * @file GoalForm.tsx
 * @description Affiche le formulaire de création et de validation d’un objectif.
 * @author Copilot
 * @date 2026-11-17
 * @version 1.0.0
 * @license MIT
 */

import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { Task } from '../types/goalget';
import { goalSchema } from '../lib/schemas';

const DAYS = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI', 'DIMANCHE'] as const;
type Day = typeof DAYS[number];

// On s'assure que le nom de la prop correspond à celui utilisé dans App.tsx
export default function GoalForm({ onAddGoal }: { onAddGoal: (newGoals: Task[]) => void }) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('Sigma');
  const [days, setDays] = useState<Day[]>(['LUNDI']);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = goalSchema.safeParse({ text, priority, days });

    if (!payload.success) {
      toast.error(payload.error.issues[0].message);
      return;
    }

    const token = localStorage.getItem('daily-goal-token');

    try {
      const response = await fetch('http://localhost:5000/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload.data),
      });

      if (response.ok) {
        const newGoals: Task[] = await response.json();
        
        // 1. Déclenchement du Toast (succès)
        toast.success("Objectif ajouté au registre, Sigma ! 🗿"); 
        
        setText(''); 
        onAddGoal(newGoals);
      } else {
        toast.error("Le serveur a refusé l'objectif...");
      }
    } catch (error) {
      toast.error("Erreur de connexion : le serveur est-il allumé ?");
      console.error("Erreur :", error);
    }
  };

  const toggleDay = (day: Day) => {
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
          onChange={(e) => setText(e.target.value)}
          placeholder="Ex: Maîtriser Docker..." 
          className="input input-bordered w-full focus:input-primary"
        />
      </div>

      <div className="flex gap-2">
        <select 
          className="select select-bordered select-sm flex-1"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="Sigma">🗿 Sigma</option>
          <option value="Indispensable">🔥 Indispensable</option>
          <option value="Cool">😎 Cool</option>
        </select>
      </div>

      <fieldset className="min-h-0">
        <legend className="label-text mb-1">Jours</legend>
        <div className="grid grid-cols-4 gap-1">
          {DAYS.map((day) => (
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

      <button type="submit" className="btn btn-primary btn-sm mt-auto shadow-md">
        Ajouter
      </button>
    </form>
  );
}