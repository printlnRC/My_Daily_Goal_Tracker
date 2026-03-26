import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const GoalChart = ({ goals }) => {
  // Logique pour compter les goals complétés par jour (simplifiée ici)
  const data = [
    { day: 'Lun', qty: 2 },
    { day: 'Mar', qty: 5 },
    { day: 'Mer', qty: 3 },
    { day: 'Jeu', qty: 8 },
    { day: 'Ven', qty: 6 },
  ];

  return (
    <div className="bg-base-300 p-6 rounded-2xl shadow-lg h-full w-full">
      <h2 className="text-xl font-bold text-secondary mb-4">Progression Hebdomadaire</h2>
      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorQty" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#641ae6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#641ae6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#444" />
          <XAxis dataKey="day" stroke="#A6ADBB" />
          <YAxis stroke="#A6ADBB" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1d232a', border: 'none', borderRadius: '8px' }}
          />
          <Area 
            type="monotone" 
            dataKey="qty" 
            stroke="#641ae6" 
            fillOpacity={1} 
            fill="url(#colorQty)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};