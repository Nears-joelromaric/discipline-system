import React, { useState, useRef } from 'react';
import { UniversalParser } from '../utils/parser';
import { usePlanningStore } from '../stores/planningStore';
import { Upload, X, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface ImportModalProps {
  onClose: () => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({ onClose }) => {
  const { loadPlanning } = usePlanningStore();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setStatus('loading');
    setMessage(`Parsing ${file.name}...`);

    try {
      const planning = await UniversalParser.parseFile(file);
      loadPlanning(planning);
      setStatus('success');
      setMessage(`Planning "${planning.title}" chargé ! ${planning.totalWeeks} semaines, ${planning.weeks.flatMap(w => w.tasks).length} tâches.`);
      setTimeout(onClose, 2000);
    } catch (err: any) {
      setStatus('error');
      setMessage(`Erreur : ${err.message}`);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Importer un planning</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div
          onDrop={handleDrop}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            dragOver ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'
          }`}
        >
          <Upload className="mx-auto mb-3 text-gray-400" size={40} />
          <p className="font-medium text-gray-700">Glissez un fichier ici</p>
          <p className="text-sm text-gray-500 mt-1">ou cliquez pour sélectionner</p>
          <div className="flex justify-center gap-2 mt-3">
            {['JSON', 'CSV', 'Excel', 'TXT'].map(f => (
              <span key={f} className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">{f}</span>
            ))}
          </div>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept=".json,.csv,.xlsx,.xls,.txt"
          onChange={handleFileInput}
          className="hidden"
        />

        {status !== 'idle' && (
          <div className={`mt-4 p-3 rounded flex items-start gap-2 ${
            status === 'success' ? 'bg-green-50 text-green-800' :
            status === 'error' ? 'bg-red-50 text-red-800' :
            'bg-blue-50 text-blue-800'
          }`}>
            {status === 'success' && <CheckCircle size={18} />}
            {status === 'error' && <AlertCircle size={18} />}
            {status === 'loading' && <FileText size={18} />}
            <p className="text-sm">{message}</p>
          </div>
        )}

        <div className="mt-4 p-3 bg-gray-50 rounded">
          <p className="text-xs font-medium text-gray-600 mb-1">Format JSON attendu :</p>
          <pre className="text-xs text-gray-500 overflow-x-auto">{`{
  "title": "Mon Planning",
  "weeks": [{
    "number": 1,
    "title": "Semaine 1",
    "tasks": [{"time": "09:00", "activity": "...", "duration": 60, "type": "memoire", "points": 10}]
  }]
}`}</pre>
        </div>
      </div>
    </div>
  );
};
