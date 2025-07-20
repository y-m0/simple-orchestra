
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Mon', tasks: 24 },
  { name: 'Tue', tasks: 32 },
  { name: 'Wed', tasks: 28 },
  { name: 'Thu', tasks: 46 },
  { name: 'Fri', tasks: 38 },
  { name: 'Sat', tasks: 16 },
  { name: 'Sun', tasks: 12 },
];

export function TaskCompletionChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 15,
          right: 30,
          left: 20,
          bottom: 10,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
        <XAxis 
          dataKey="name" 
          stroke="#888" 
          tick={{ fill: '#888' }}
          axisLine={{ stroke: 'rgba(156, 163, 175, 0.2)' }}
        />
        <YAxis 
          stroke="#888" 
          tick={{ fill: '#888' }}
          axisLine={{ stroke: 'rgba(156, 163, 175, 0.2)' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'rgba(30, 41, 59, 0.8)',
            borderColor: 'rgba(139, 92, 246, 0.3)',
            borderRadius: '0.375rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            color: '#fff',
            padding: '10px'
          }}
          labelStyle={{
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '5px',
            fontWeight: 'bold'
          }}
          itemStyle={{
            color: '#9b87f5',
            padding: '2px 0'
          }}
        />
        <Legend 
          wrapperStyle={{
            paddingTop: '10px'
          }}
          formatter={(value) => <span style={{ color: '#888' }}>{value}</span>}
        />
        <Line
          type="monotone"
          dataKey="tasks"
          stroke="#9b87f5"
          strokeWidth={3}
          dot={{ r: 4, strokeWidth: 2, fill: '#1e293b' }}
          activeDot={{ r: 7, stroke: '#8B5CF6', strokeWidth: 2 }}
          name="Tasks Completed"
          animationDuration={1500}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
