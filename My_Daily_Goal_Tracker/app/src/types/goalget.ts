/**
 * @file goalget.ts
 * @description Définit le type des objectifs récupérés et affichés dans l’application.
 * @author Copilot
 * @date 2026-11-17
 * @version 1.0.0
 * @license MIT
 */

export interface Task {
  id: number;
  text: string;
  day: 'LUNDI' | 'MARDI' | 'MERCREDI' | 'JEUDI' | 'VENDREDI' | 'SAMEDI' | 'DIMANCHE';
  priority: string;
  completed: boolean;
  createdAt: string;
}