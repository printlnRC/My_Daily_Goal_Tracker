export interface Goal {
  id: number;
  text: string;
  day: 'LUNDI' | 'MARDI' | 'MERCREDI' | 'JEUDI' | 'VENDREDI' | 'SAMEDI' | 'DIMANCHE';
  priority: 'Sigma' | 'Indispensable' | 'Cool';
  createdAt: string; // ou Date si tu préfères
}