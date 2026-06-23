export interface GoalGraphData {
  day: string;
  qty: number;
  completed: number;
}

const DAYS_MAP: { [key: string]: { order: number; label: string } } = {
  LUNDI: { order: 1, label: 'Lun' },
  MARDI: { order: 2, label: 'Mar' },
  MERCREDI: { order: 3, label: 'Mer' },
  JEUDI: { order: 4, label: 'Jeu' },
  VENDREDI: { order: 5, label: 'Ven' },
  SAMEDI: { order: 6, label: 'Sam' },
  DIMANCHE: { order: 7, label: 'Dim' }
};

const PriorityMap: { [key: string]: number } = {
  Sigma: 1,
  Indispensable: 2,
  Cool: 3
};

export { PriorityMap };

export { DAYS_MAP };