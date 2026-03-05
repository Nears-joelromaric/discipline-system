import React from 'react';
import { usePlanningStore } from '../stores/planningStore';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const TYPE_COLORS: Record<string, string> = {
  memoire: '#6366f1',
  certif: '#f59e0b',
  anglais: '#10b981',
  finance: '#3b82f6',
  sport: '#ef4444',
  autre: '#8b5cf6',
};

const TYPE_LABELS: Record<string, string> = {
  memoire: 'Mémoire',
  certif: 'Certification',
  anglais: 'Anglais',
  finance: 'Finance',
  sport: 'Sport',
  autre: 'Autre',
};

export const Analytics: React.FC = () => {
  const { tasks, planning } = usePlanningStore();

  const weeklyData = planning?.weeks.map(w => {
    const weekTasks = tasks.filter(t => t.weekNumber === w.number);
    const completed = weekTasks.filter(t => t.completed);
    return {
      name: `S${w.number}`,
      total: weekTasks.length,
      completed: completed.length,
      points: completed.reduce((s, t) => s + t.points, 0),
    };
  }) || [];

  const typeData = Object.entries(
    tasks.reduce((acc, t) => {
      acc[t.type] = (acc[t.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([type, count]) => ({ name: TYPE_LABELS[type] || type, value: count, type }));

  const completedByType = Object.entries(
    tasks.filter(t => t.completed).reduce((acc, t) => {
      acc[t.type] = (acc[t.type] || 0) + t.points;
      return acc;
    }, {} as Record<string, number>)
  ).map(([type, points]) => ({
    name: TYPE_LABELS[type] || type,
    points,
    color: TYPE_COLORS[type] || '#8b5cf6',
  }));

  if (tasks.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">Importez un planning pour voir les analytics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Analytics</h2>
          <p className="text-gray-500">{planning?.title}</p>
        </div>

        {/* Weekly progress */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Progression par semaine</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#e0e7ff" name="Total" />
              <Bar dataKey="completed" fill="#4f46e5" name="Complétées" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Type distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Répartition par type</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={typeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}>
                  {typeData.map((entry, i) => (
                    <Cell key={i} fill={TYPE_COLORS[entry.type] || '#8b5cf6'} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Points by type */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Points gagnés par type</h3>
            <div className="space-y-3">
              {completedByType.sort((a, b) => b.points - a.points).map(item => (
                <div key={item.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{item.name}</span>
                    <span className="font-medium">{item.points} pts</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${(item.points / Math.max(...completedByType.map(x => x.points), 1)) * 100}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
              {completedByType.length === 0 && (
                <p className="text-gray-400 text-sm text-center">Aucune tâche complétée</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
