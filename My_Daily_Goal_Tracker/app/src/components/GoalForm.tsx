/**
 * GoalForm.tsx
 * Le composant permet d'ajouter un nouveau GOAL en envoyant une requête POST à l'API.
 * et l'utilisateur reçois un toast de confirmation ou d'erreur selon le résultat de la requête.
 * @author Sam
 * @param onAddGoal - Fonction passée depuis App.tsx pour ajouter le nouvel objectif à la liste affichée
 * @returns Un formulaire avec un champ de texte, une sélection de priorité et un bouton d'ajout
 * @version 1.0
 * @date 2026-03-02
 * @license MIT
 */

import { useState } from 'react';
import { toast } from 'sonner';
import { Goal } from '../types/goal';

// On s'assure que le nom de la prop correspond à celui utilisé dans App.tsx
export default function GoalForm({ onAddGoal }: { onAddGoal: (newGoal: Goal) => void }) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('Sigma');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const response = await fetch('http://localhost:5000/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, priority }),
      });

      if (response.ok) {
        const newGoal: Goal = await response.json(); // On récupère l'objet créé par la base
        
        // 1. Déclenchement du Toast (succès)
        toast.success("Objectif ajouté au registre, Sigma ! 🗿"); 
        
        setText(''); 
        onAddGoal(newGoal); // 2. On passe l'objet complet à App.tsx pour l'affichage
      } else {
        toast.error("Le serveur a refusé l'objectif...");
      }
    } catch (error) {
      toast.error("Erreur de connexion : le serveur est-il allumé ?");
      console.error("Erreur :", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-base-200 p-6 rounded-2xl shadow-lg flex flex-col gap-4 h-full">
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
          className="select select-bordered flex-1"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="Sigma">🗿 Sigma</option>
          <option value="Indispensable">🔥 Indispensable</option>
          <option value="Cool">😎 Cool</option>
        </select>

        <button type="submit" className="btn btn-primary px-8 shadow-md">
          Ajouter
        </button>
      </div>
    </form>
  );
}