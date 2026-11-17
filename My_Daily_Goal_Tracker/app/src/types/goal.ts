/**
 * @file goal.ts
 * @description Définit le type représentant un objectif.
 * @author Copilot
 * @date 2026-11-17
 * @version 1.0.0
 * @license MIT
 */

export interface Goal {
  id: number;
  text: string;
  day: 'LUNDI' | 'MARDI' | 'MERCREDI' | 'JEUDI' | 'VENDREDI' | 'SAMEDI' | 'DIMANCHE';
  priority: 'Sigma' | 'Indispensable' | 'Cool';
  createdAt: string; // ou Date si tu préfères
}