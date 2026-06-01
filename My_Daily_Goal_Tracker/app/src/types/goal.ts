/** 
 * @field goal.ts
 * @brief Interface pour représenter un objectif.
 * @description Cette interface définit la structure d'un objectif, incluant son identifiant, son texte descriptif, le jour de la semaine associé, sa priorité et sa date de création.
 * @version 1.0
 * @author Sooz (Sam)
 * @date 2026-03-02
 * @license MIT
 */

/** 
 * @brief Interface pour représenter un objectif.
 */
export interface Goal {
  id: number;
  text: string;
  day: 'LUNDI' | 'MARDI' | 'MERCREDI' | 'JEUDI' | 'VENDREDI' | 'SAMEDI' | 'DIMANCHE';
  priority: 'Sigma' | 'Indispensable' | 'Cool';
  createdAt: string; // ou Date si tu préfères
}