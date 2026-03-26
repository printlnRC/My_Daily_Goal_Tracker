export interface Goal {
  id: number;
  text: string;
  priority: 'Sigma' | 'Indispensable' | 'Cool';
  createdAt: string; // ou Date si tu préfères
}