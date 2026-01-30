import { useState } from "react";

// On exporte les types pour pouvoir les réutiliser ailleurs
export type Priority = "Minimale" | "Recommander" | "Sigma";

export type Task = {
  id: number;
  text: string;
  priority: Priority;
};

interface GoalFormProps {
  onAddGoal: (task: Task) => void;
}

export default function GoalForm({ onAddGoal }: GoalFormProps) {
  const [input, setInput] = useState<string>("");
  const [priority, setPriority] = useState<Priority>("Recommander");

  const handleSubmit = () => {
    if (input.trim() === "") return;

    const newGoal: Task = {
      id: Date.now(),
      text: input.trim(),
      priority: priority,
    };

    onAddGoal(newGoal); // On envoie l'objet à la fonction parente
    setInput(""); // On vide le champ
    setPriority("Recommander");
  };

  return (
    <div className="w-full flex flex-col gap-4 bg-base-300 p-5 rounded-2xl">
      <div className="flex gap-4">
        <input
          type="text"
          className="input w-full"
          placeholder="Ajouter une tâche"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <select
          className="select w-full"
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
        >
          <option value="Sigma">Sigma 🗿</option>
          <option value="Recommander">Recommander</option>
          <option value="Minimale">Minimale</option>
        </select>
        <button onClick={handleSubmit} className="btn btn-primary">
          Ajouter
        </button>
      </div>
    </div>
  );
}