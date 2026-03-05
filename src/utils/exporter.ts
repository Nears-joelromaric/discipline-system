import * as XLSX from 'xlsx';
import type { Task, TaskAction, Planning } from '../types';

export function exportToJSON(planning: Planning, tasks: Task[], actions: TaskAction[]) {
  const data = {
    planning,
    tasks,
    actions,
    exportedAt: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  downloadBlob(blob, `discipline-system-${formatDate()}.json`);
}

export function exportToExcel(tasks: Task[], actions: TaskAction[]) {
  const wb = XLSX.utils.book_new();

  const tasksData = tasks.map(t => ({
    ID: t.id,
    Semaine: t.weekNumber,
    Date: new Date(t.date).toLocaleDateString('fr-FR'),
    Heure: t.time,
    Activité: t.activity,
    Durée: t.duration,
    Type: t.type,
    Points: t.points,
    Complété: t.completed ? 'Oui' : 'Non',
    'Complété le': t.completedAt ? new Date(t.completedAt).toLocaleString('fr-FR') : '',
  }));

  const actionsData = actions.map(a => ({
    ID: a.id,
    Action: a.action,
    'ID Tâche': a.taskId,
    Horodatage: new Date(a.timestamp).toLocaleString('fr-FR'),
    Justification: a.justification,
  }));

  const wsTasks = XLSX.utils.json_to_sheet(tasksData);
  const wsActions = XLSX.utils.json_to_sheet(actionsData);

  XLSX.utils.book_append_sheet(wb, wsTasks, 'Tâches');
  XLSX.utils.book_append_sheet(wb, wsActions, 'Historique');

  XLSX.writeFile(wb, `discipline-system-${formatDate()}.xlsx`);
}

function formatDate(): string {
  return new Date().toISOString().split('T')[0];
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
