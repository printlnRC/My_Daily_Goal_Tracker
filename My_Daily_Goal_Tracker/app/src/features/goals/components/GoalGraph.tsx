/**
 * @file GoalGraph.tsx
 * @description Affiche le graphique des objectifs par jour avec filtre de priorité.
 * @author Copilot
 * @date 2026-11-18
 * @version 1.0.0
 * @license MIT
 */

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { GoalGraphData, GoalPriorityFilter } from '../types/goalGraph.types';

const WEEKDAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

type GoalGraphProps = {
  graphData: GoalGraphData[];
  priorityFilter: GoalPriorityFilter;
  onPriorityFilterChange: (priority: GoalPriorityFilter) => void;
};

export default function GoalGraph({
  graphData,
  priorityFilter,
  onPriorityFilterChange,
}: GoalGraphProps) {
  const today = new Date();
  const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - ((today.getDay() + 6) % 7));
  const weekDates = WEEKDAYS.map((_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return date;
  });

  return (
    <div className="bg-base-300 p-6 rounded-2xl shadow-lg h-full w-full flex flex-col">
      <div className="flex justify-end mb-2">
        <select
          className="select select-bordered select-sm"
          value={priorityFilter}
          onChange={(event) => onPriorityFilterChange(event.target.value as GoalPriorityFilter)}
          aria-label="Filtrer le graphique par priorité"
        >
          <option value="Tous">Tous</option>
          <option value="Sigma">🗿 Sigma</option>
          <option value="Indispensable">🔥 Indispensable</option>
          <option value="Cool">😎 Cool</option>
        </select>
      </div>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={graphData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
            <defs>
              <linearGradient id="colorQty" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c7d926" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#c7d926" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#27bd3b" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#27bd3b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#444" />
            <XAxis
              dataKey="day"
              stroke="#6B7280"
              height={58}
              tickMargin={12}
              tick={({ x, y, index }) => {
                const date = weekDates[index];
                return (
                  <text x={x} y={y} textAnchor="middle" fill="#374151" fontSize={12} fontWeight={500}>
                    <tspan x={x} dy="0">{WEEKDAYS[index]}</tspan>
                    <tspan x={x} dy="18">
                      {date ? `${date.getDate()}/${String(date.getMonth() + 1).padStart(2, '0')}` : ''}
                    </tspan>
                  </text>
                );
              }}
            />
            <YAxis stroke="#A6ADBB" allowDecimals={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#F7F3E8', border: 'none', borderRadius: '12px', color: '#fff' }}
            />
            <Legend verticalAlign="top" height={36} />
            <Area
              name="Objectifs non terminés"
              type="monotone"
              dataKey="qty"
              stroke="#1F2A2A"
              fillOpacity={1}
              fill="url(#colorQty)"
            />
            <Area
              name="Objectifs terminés"
              type="monotone"
              dataKey="completed"
              stroke="#2E8B57"
              fillOpacity={1}
              fill="url(#colorCompleted)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
