import React, { useState } from 'react';
import { usePlanningStore } from '../stores/planningStore';
import type { Task } from '../types';
import { TaskModal } from './TaskModal';
import { Check, Edit, Trash2, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const TYPE_COLORS: Record<string, string> = {
  memoire: 'bg-indigo-100 text-indigo-800',
  certif: 'bg-yellow-100 text-yellow-800',
  anglais: 'bg-green-100 text-green-800',
  finance: 'bg-blue-100 text-blue-800',
  sport: 'bg-red-100 text-red-800',
  autre: 'bg-purple-100 text-purple-800',
};

const TYPE_LABELS: Record<string, string> = {
  memoire: 'Mémoire',
  certif: 'Certif',
  anglais: 'Anglais',
  finance: 'Finance',
  sport: 'Sport',
  autre: 'Autre',
};

export const TaskList: React.FC = () => {
  const { tasks, currentWeek, setCurrentWeek, toggleTask, planning } = usePlanningStore();
  const [modal, setModal] = useState<{ mode: 'create' | 'edit' | 'delete'; task?: Task } | null>(null);

  const weekTasks = tasks
    .filter(t => t.weekNumber === currentWeek)
    .sort((a, b) => a.time.localeCompare(b.time));

  const totalWeeks = planning?.totalWeeks || 1;

  const completed = weekTasks.filter(t => t.completed).length;
  const points = weekTasks.filter(t => t.completed).reduce((s, t) => s + t.points, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Week navigation */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentWeek(Math.max(1, currentWeek - 1))}
              disabled={currentWeek <= 1}
              className="p-2 rounded hover:bg-gray-100 disabled:opacity-30"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-800">Semaine {currentWeek}</h2>
              <p className="text-sm text-gray-500">{completed}/{weekTasks.length} tâches · {points} pts</p>
            </div>
            <button
              onClick={() => setCurrentWeek(Math.min(totalWeeks, currentWeek + 1))}
              disabled={currentWeek >= totalWeeks}
              className="p-2 rounded hover:bg-gray-100 disabled:opacity-30"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {weekTasks.length > 0 && (
            <div className="mt-3 w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all"
                style={{ width: `${(completed / weekTasks.length) * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* Add task button */}
        <div className="mb-4">
          <button
            onClick={() => setModal({ mode: 'create' })}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus size={18} />
            Ajouter une tâche
          </button>
        </div>

        {/* Task list */}
        <div className="space-y-2">
          {weekTasks.length === 0 && (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-400">
              Aucune tâche pour cette semaine
            </div>
          )}

          {weekTasks.map(task => (
            <div
              key={task.id}
              className={`bg-white rounded-lg shadow p-4 flex items-center gap-3 transition-all ${
                task.completed ? 'opacity-70' : ''
              }`}
            >
              <button
                onClick={() => toggleTask(task.id)}
                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  task.completed
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-gray-300 hover:border-green-400'
                }`}
              >
                {task.completed && <Check size={14} />}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-gray-800 truncate">{task.activity}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${TYPE_COLORS[task.type] || 'bg-gray-100'}`}>
                    {TYPE_LABELS[task.type] || task.type}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {task.time} · {task.duration}min · {task.points}pts
                </div>
              </div>

              <div className="flex gap-1 flex-shrink-0">
                <button
                  onClick={() => setModal({ mode: 'edit', task })}
                  className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => setModal({ mode: 'delete', task })}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modal && (
        <TaskModal
          task={modal.task}
          mode={modal.mode}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
};
