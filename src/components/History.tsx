import React from 'react';
import { usePlanningStore } from '../stores/planningStore';
import { PlusCircle, Edit, Trash2, Download } from 'lucide-react';
import { exportToJSON, exportToExcel } from '../utils/exporter';

export const History: React.FC = () => {
  const { actions, tasks, planning } = usePlanningStore();

  const sortedActions = [...actions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const icons = {
    create: <PlusCircle size={18} className="text-green-600" />,
    update: <Edit size={18} className="text-blue-600" />,
    delete: <Trash2 size={18} className="text-red-600" />,
  };

  const labels = {
    create: 'Création',
    update: 'Modification',
    delete: 'Suppression',
  };

  const colors = {
    create: 'bg-green-50 border-green-200',
    update: 'bg-blue-50 border-blue-200',
    delete: 'bg-red-50 border-red-200',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Historique des actions</h2>
              <p className="text-gray-500">{sortedActions.length} action(s) enregistrée(s)</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => planning && exportToJSON(planning, tasks, actions)}
                className="flex items-center gap-1 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                disabled={!planning}
              >
                <Download size={16} />
                JSON
              </button>
              <button
                onClick={() => exportToExcel(tasks, actions)}
                className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
              >
                <Download size={16} />
                Excel
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {sortedActions.length === 0 && (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-400">
              Aucune action enregistrée
            </div>
          )}

          {sortedActions.map(action => (
            <div
              key={action.id}
              className={`bg-white rounded-lg shadow border p-4 ${colors[action.action]}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{icons[action.action]}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800">
                      {labels[action.action]} — {action.newState?.activity || action.previousState?.activity || 'Tâche'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(action.timestamp).toLocaleString('fr-FR')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 italic">"{action.justification}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
