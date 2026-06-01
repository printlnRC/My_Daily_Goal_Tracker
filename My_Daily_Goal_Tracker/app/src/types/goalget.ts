export interface Task {
  id: number;
  text: string;
  day: 'LUNDI' | 'MARDI' | 'MERCREDI' | 'JEUDI' | 'VENDREDI' | 'SAMEDI' | 'DIMANCHE';
  priority: string;
  completed: boolean;
  createdAt: string;
}