/**
 * @file GoalGraph.tsx
 * @description Composant React pour afficher un graphique des objectifs (goals) créés et complétés par jour de la semaine.
 * Il utilise la bibliothèque Recharts pour visualiser les données sous forme de courbes.
 * Le graphique affiche deux courbes : une pour le nombre total d'objectifs créés (en violet) et une pour le nombre d'objectifs complétés (en vert). Les données sont passées en props depuis le composant parent (App.tsx) après avoir été formatées à partir des données récupérées du backend.
 * @version 1.0
 * @author Sooz (Sam)
 * @date 2026-03-02
 * @license MIT
 */

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

/**
 * @brief Composant pour afficher un graphique des objectifs créés et complétés par jour de la semaine.
 * @param graphData - Un tableau d'objets contenant les données à afficher dans le graphique, avec les propriétés "day", "qty" (nombre total d'objectifs créés) et "completed" (nombre d'objectifs complétés).
 * @returns Un composant graphique utilisant Recharts pour visualiser les données.
 */
export default function GoalGraph({ graphData }: { graphData: any[] }) {
  return (
    <div className="bg-base-300 p-6 rounded-2xl shadow-lg h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={graphData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            {/* Dégradé pour les objectifs créés (Primary - Violet) */}
            <linearGradient id="colorQty" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#c7d926" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#c7d926" stopOpacity={0}/>
            </linearGradient>
            {/* Dégradé pour les objectifs terminés (Secondary - Rose ou Vert selon ton thème) */}
            <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#27bd3b" stopOpacity={0.6}/>
              <stop offset="95%" stopColor="#27bd3b" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#444" />
          <XAxis 
            dataKey="day" 
            stroke="#A6ADBB"
            tickFormatter={(value, index) => {
              const dataPoint = graphData[index];
              return dataPoint ? `${value}\n${dataPoint.date}` : value;
            }}
          />
          <YAxis stroke="#A6ADBB" allowDecimals={false} />
          
          <Tooltip 
            contentStyle={{ backgroundColor: '#1d232a', border: 'none', borderRadius: '12px', color: '#fff' }}
          />
          <Legend verticalAlign="top" height={36} />

          {/* Courbe 1 : Objectifs Créés (Total) */}
          <Area 
            name="Objectifs créés"
            type="monotone" 
            dataKey="qty" 
            stroke="#c7d926" 
            fillOpacity={1} 
            fill="url(#colorQty)" 
          />

          {/* Courbe 2 : Objectifs Complétés */}
          <Area 
            name="Objectifs terminés"
            type="monotone" 
            dataKey="completed" 
            stroke="#27bd3b" 
            fillOpacity={1} 
            fill="url(#colorCompleted)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}