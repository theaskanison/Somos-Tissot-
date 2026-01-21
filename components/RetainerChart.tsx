import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Strategic Investment (Retainer)', value: 3, color: '#CC0000' },
  { name: 'Execution Balance', value: 97, color: '#333333' },
];

export const RetainerChart: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between w-full h-full gap-8">
      <div className="w-full md:w-1/2 h-64 md:h-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
                contentStyle={{ backgroundColor: '#000', borderColor: '#333', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
                <span className="text-3xl font-bold text-red-600">3%</span>
                <p className="text-[10px] text-gray-400 uppercase leading-tight mt-1">Managed<br/>Risk</p>
            </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 space-y-6">
        <h3 className="text-2xl font-bold mb-4">The "Managed Innovation" Model</h3>
        
        <div className="bg-neutral-900 p-4 rounded-lg border-l-4 border-red-600">
            <h4 className="font-bold text-white">1. Discovery & Strategy</h4>
            <p className="text-sm text-gray-400 mt-1">A minimal 3% retainer to define high-value outcomes and technical feasibility before full commitment.</p>
        </div>

        <div className="bg-neutral-900 p-4 rounded-lg border-l-4 border-gray-600">
            <h4 className="font-bold text-white">2. Clear Action Plans</h4>
            <p className="text-sm text-gray-400 mt-1">We deliver a validated SOW, eliminating technical unknowns and budget surprises.</p>
        </div>

        <div className="bg-neutral-900 p-4 rounded-lg border-l-4 border-green-600">
            <h4 className="font-bold text-white">3. Performance Credit</h4>
            <p className="text-sm text-gray-400 mt-1">The discovery fee is credited back against the final production budget upon approval.</p>
        </div>
      </div>
    </div>
  );
};