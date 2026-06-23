import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DAYS_MAP } from '../types/goalGrap';

export default function GoalGraph({ graphData }: { graphData: any[] }) {
  const [priorityFilter, setPriorityFilter] = useState<string>('Tous');
  const [filteredData, setFilteredData] = useState<any[]>(graphData);

  const buildWeeklyData = (totals: any[], completeds: any[]) => {
    const weeklyData: { [key: string]: { day: string; qty: number; completed: number; order: number } } = {};
    Object.keys(DAYS_MAP).forEach((dayKey) => {
      weeklyData[dayKey] = {
        day: DAYS_MAP[dayKey].label,
        qty: 0,
        completed: 0,
        order: DAYS_MAP[dayKey].order
      };
    });

    totals.forEach((item: any) => {
      if (weeklyData[item.day]) {
        weeklyData[item.day].qty = item._count?.day ?? 0;
      }
    });

    completeds.forEach((item: any) => {
      if (weeklyData[item.day]) {
        weeklyData[item.day].completed = item._count?.day ?? 0;
      }
    });

    return Object.values(weeklyData).sort((a, b) => a.order - b.order);
  };

  useEffect(() => {
    if (priorityFilter === 'Tous') {
      setFilteredData(graphData);
      return;
    }

    const fetchPriorityData = async () => {
      try {
        const [resTotals, resCompleted] = await Promise.all([
          fetch(`http://localhost:5000/api/goals/graph/priority/${priorityFilter}`),
          fetch(`http://localhost:5000/api/goals/graph/completed/priority/${priorityFilter}`)
        ]);

        if (!resTotals.ok || !resCompleted.ok) {
          throw new Error('Impossible de charger les données par priorité');
        }

        const totals = await resTotals.json();
        const completeds = await resCompleted.json();
        setFilteredData(buildWeeklyData(totals, completeds));
      } catch (error) {
        console.error('Erreur lors du filtrage du graphique par priorité :', error);
        setFilteredData(graphData);
      }
    };

    void fetchPriorityData();
  }, [priorityFilter, graphData]);

  return (
    <div className="bg-base-300 p-6 rounded-2xl shadow-lg h-full w-full flex flex-col">
      
      {/* Aligne le menu déroulant proprement en haut à droite */}
      <div className="flex justify-end mb-2">
        <select 
          className="select select-bordered select-sm"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="Tous">Tous</option>
          <option value="Sigma">🗿 Sigma</option>
          <option value="Indispensable">🔥 Indispensable</option>
          <option value="Cool">😎 Cool</option>
        </select>
      </div>

      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorQty" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c7d926" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#c7d926" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#27bd3b" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#27bd3b" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#444" />
            <XAxis dataKey="day" stroke="#A6ADBB" />
            <YAxis stroke="#A6ADBB" allowDecimals={false} />
            
            <Tooltip 
              contentStyle={{ backgroundColor: '#1d232a', border: 'none', borderRadius: '12px', color: '#fff' }}
            />
            <Legend verticalAlign="top" height={36} />

            <Area 
              name="Objectifs créés"
              type="monotone" 
              dataKey="qty" 
              stroke="#c7d926" 
              fillOpacity={1} 
              fill="url(#colorQty)" 
            />

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

    </div>
  );
}