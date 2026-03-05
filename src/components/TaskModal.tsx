import React, { useState } from 'react';
import type { Task } from '../types';
import { usePlanningStore } from '../stores/planningStore';
import { X } from 'lucide-react';

interface TaskModalProps {
  task?: Task;
  mode: 'create' | 'edit' | 'delete';
  onClose: () => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ task, mode, onClose }) => {
  const { addTask, updateTask, deleteTask } = usePlanningStore();
  const [justification, setJustification] = useState('');
  const [formData, setFormData] = useState<Partial<Task>>(task || {
    time: '00:00',
    activity: '',
    duration: 30,
    type: 'autre',
    points: 5,
    weekNumber: 1,
    date: new Date(),
  });

  const handleSubmit = () => {
    if (!justification.trim()) {
      alert('Justification requise');
      return;
    }

    if (mode === 'create') {
      addTask(formData as Omit<Task, 'id'>, justification);
    } else if (mode === 'edit' && task) {
      updateTask(task.id, formData, justification);
    } else if (mode === 'delete' && task) {
      deleteTask(task.id, justification);
    }

    onClose();
  };

  const titles = {
    create: '+ Ajouter une tâche',
    edit: 'Modifier la tâche',
    delete: 'Supprimer la tâche',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{titles[mode]}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {mode !== 'delete' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Heure</label>
              <input
                type="time"
                value={formData.time}
                onChange={e => setFormData({ ...formData, time: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Activité</label>
              <input
                type="text"
                value={formData.activity}
                onChange={e => setFormData({ ...formData, activity: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="Nom de l'activité"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Durée (min)</label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Points</label>
                <input
                  type="number"
                  value={formData.points}
                  onChange={e => setFormData({ ...formData, points: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value as Task['type'] })}
                className="w-full p-2 border rounded"
              >
                <option value="memoire">Mémoire</option>
                <option value="certif">Certification</option>
                <option value="anglais">Anglais</option>
                <option value="finance">Finance</option>
                <option value="sport">Sport</option>
                <option value="autre">Autre</option>
              </select>
            </div>
          </div>
        )}

        {mode === 'delete' && (
          <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
            <p className="text-red-800">
              Êtes-vous sûr de vouloir supprimer cette tâche ?<br />
              <strong>{task?.activity}</strong>
            </p>
          </div>
        )}

        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">
            Justification {mode === 'delete' ? 'de suppression' : ''} *
          </label>
          <textarea
            value={justification}
            onChange={e => setJustification(e.target.value)}
            placeholder="Pourquoi cette action ?"
            className="w-full p-2 border rounded h-20"
            required
          />
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className={`flex-1 px-4 py-2 rounded text-white ${
              mode === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {mode === 'delete' ? 'Supprimer' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  );
};
