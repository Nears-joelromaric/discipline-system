import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { TaskList } from './components/TaskList';
import { Analytics } from './components/Analytics';
import { History } from './components/History';
import { ImportModal } from './components/ImportModal';
import { usePlanningStore } from './stores/planningStore';
import { AlarmEngine } from './utils/alarms';
import { requestNotificationPermission } from './utils/notifications';
import { LayoutDashboard, ListTodo, BarChart2, History as HistoryIcon, Upload, BellRing } from 'lucide-react';

type Tab = 'dashboard' | 'tasks' | 'analytics' | 'history';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [showImport, setShowImport] = useState(false);
  const { tasks, alarms, planning } = usePlanningStore();

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      AlarmEngine.start(alarms, tasks);
    }
    return () => AlarmEngine.stop();
  }, [alarms, tasks]);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Tableau de bord', icon: <LayoutDashboard size={18} /> },
    { id: 'tasks', label: 'Tâches', icon: <ListTodo size={18} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={18} /> },
    { id: 'history', label: 'Historique', icon: <HistoryIcon size={18} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="bg-indigo-700 text-white px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2">
          <BellRing size={22} />
          <span className="font-bold text-lg">Discipline System</span>
          {planning && (
            <span className="text-indigo-200 text-sm ml-2 hidden sm:inline">— {planning.title}</span>
          )}
        </div>
        <button
          onClick={() => setShowImport(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-indigo-700 rounded-lg hover:bg-indigo-50 text-sm font-medium"
        >
          <Upload size={16} />
          Importer
        </button>
      </header>

      {/* No planning state */}
      {!planning && activeTab !== 'history' && (
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
            <div className="text-6xl mb-4">📅</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Bienvenue !</h2>
            <p className="text-gray-500 mb-6">
              Importez votre planning pour commencer à gérer vos tâches et suivre votre progression.
            </p>
            <button
              onClick={() => setShowImport(true)}
              className="flex items-center gap-2 mx-auto px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
            >
              <Upload size={18} />
              Importer un planning
            </button>
            <p className="text-xs text-gray-400 mt-4">Formats : JSON, CSV, Excel (.xlsx), Texte (.txt)</p>
          </div>
        </div>
      )}

      {/* Content */}
      {(planning || activeTab === 'history') && (
        <main className="flex-1 overflow-auto">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'tasks' && <TaskList />}
          {activeTab === 'analytics' && <Analytics />}
          {activeTab === 'history' && <History />}
        </main>
      )}

      {/* Bottom nav */}
      <nav className="bg-white border-t border-gray-200 flex shadow-up">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center py-2 px-1 text-xs gap-1 transition-colors ${
              activeTab === tab.id
                ? 'text-indigo-600 border-t-2 border-indigo-600 -mt-px'
                : 'text-gray-500 hover:text-indigo-500'
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </nav>

      {showImport && <ImportModal onClose={() => setShowImport(false)} />}
    </div>
  );
}
