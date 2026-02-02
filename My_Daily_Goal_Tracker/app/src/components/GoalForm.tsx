import { useState } from 'react';

export default function GoalForm({ onGoalAdded }: { onGoalAdded: () => void }) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('Sigma');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      // Connexion au backend (Port 5000)
      const response = await fetch('http://localhost:5000/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, priority }),
      });

      if (response.ok) {
        setText(''); // On vide l'input
        onGoalAdded(); // On demande à App.tsx de recharger la liste
      }
    } catch (error) {
      console.error("Erreur de connexion au serveur :", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-base-200 p-6 rounded-2xl shadow-lg flex flex-col gap-4">
      <h2 className="text-xl font-bold text-primary">Nouvel Objectif</h2>
      
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

        <button type="submit" className="btn btn-primary px-8">
          Ajouter
        </button>
      </div>
    </form>
  );
}