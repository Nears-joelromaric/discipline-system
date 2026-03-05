import React from 'react';
import { usePlanningStore } from '../stores/planningStore';
import { Calendar, TrendingUp, Target, Award, CheckSquare, Clock } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { stats, currentWeek, planning } = usePlanningStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Discipline System</h1>
              <p className="text-gray-600">{planning?.title || 'Aucun planning chargé'}</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-indigo-600">{stats.totalPoints}</div>
              <div className="text-sm text-gray-600">{stats.level}</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Semaine"
            value={`${currentWeek}/${planning?.totalWeeks || 0}`}
            icon={<Calendar />}
            color="indigo"
          />
          <StatCard
            label="Complétion"
            value={`${stats.completionRate.toFixed(0)}%`}
            icon={<TrendingUp />}
            color="green"
          />
          <StatCard
            label="Tâches"
            value={`${stats.tasksCompleted}/${stats.tasksTotal}`}
            icon={<Target />}
            color="blue"
          />
          <StatCard
            label="Série"
            value={`${stats.streak}j`}
            icon={<Award />}
            color="orange"
          />
        </div>

        {/* Progress bar */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progression globale</span>
            <span className="text-sm font-bold text-indigo-600">{stats.completionRate.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(stats.completionRate, 100)}%` }}
            />
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckSquare className="text-green-600" size={20} />
              <h3 className="font-semibold text-gray-800">Tâches complétées</h3>
            </div>
            <div className="text-3xl font-bold text-green-600">{stats.tasksCompleted}</div>
            <div className="text-sm text-gray-500">sur {stats.tasksTotal} tâches</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="text-blue-600" size={20} />
              <h3 className="font-semibold text-gray-800">Points gagnés</h3>
            </div>
            <div className="text-3xl font-bold text-blue-600">{stats.totalPoints}</div>
            <div className="text-sm text-gray-500">niveau : {stats.level}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: 'indigo' | 'green' | 'blue' | 'orange';
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color }) => {
  const colors = {
    indigo: 'text-indigo-600',
    green: 'text-green-600',
    blue: 'text-blue-600',
    orange: 'text-orange-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-600">{label}</p>
          <p className={`text-2xl font-bold ${colors[color]}`}>{value}</p>
        </div>
        <div className={colors[color]}>{icon}</div>
      </div>
    </div>
  );
};
