import React from 'react';
import type { Task, TaskStep } from '../types';
import { X, Target, ListChecks, CheckCircle2, Wrench, BookOpen, Clock, ExternalLink } from 'lucide-react';

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
}

const TYPE_COLORS: Record<string, string> = {
  memoire: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  certif: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  anglais: 'bg-green-100 text-green-800 border-green-200',
  finance: 'bg-blue-100 text-blue-800 border-blue-200',
  sport: 'bg-red-100 text-red-800 border-red-200',
  autre: 'bg-purple-100 text-purple-800 border-purple-200',
};

const TYPE_LABELS: Record<string, string> = {
  memoire: 'Mémoire',
  certif: 'Certification',
  anglais: 'Anglais',
  finance: 'Finance',
  sport: 'Sport',
  autre: 'Autre',
};

function renderInstructions(instructions: string | string[]): React.ReactNode {
  if (typeof instructions === 'string') {
    return <p className="text-gray-600 text-sm">{instructions}</p>;
  }
  return (
    <ul className="list-disc list-inside space-y-0.5">
      {instructions.map((line, i) => (
        <li key={i} className="text-gray-600 text-sm">{line}</li>
      ))}
    </ul>
  );
}

function StepBlock({ step }: { step: string | TaskStep }) {
  if (typeof step === 'string') {
    return (
      <div className="flex gap-2 items-start">
        <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">→</span>
        <span className="text-sm text-gray-700">{step}</span>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
      <div className="flex items-start gap-2 mb-1">
        {step.step !== undefined && (
          <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
            {step.step}
          </span>
        )}
        <div className="flex-1 min-w-0">
          {step.action && <p className="font-medium text-gray-800 text-sm">{step.action}</p>}
          {step.platform && <p className="text-xs text-indigo-600 font-medium">{step.platform}</p>}
        </div>
        {step.url && (
          <a href={step.url} target="_blank" rel="noopener noreferrer"
            className="text-indigo-500 hover:text-indigo-700 flex-shrink-0"
            title={step.url}>
            <ExternalLink size={14} />
          </a>
        )}
      </div>

      {step.instructions && (
        <div className="ml-8 mt-1">{renderInstructions(step.instructions)}</div>
      )}

      {step.plugins && step.plugins.length > 0 && (
        <div className="ml-8 mt-2 space-y-1">
          {step.plugins.map((p, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-700">{p.name}</span>
              <span className="text-xs text-gray-500">— {p.purpose}</span>
              {p.link && (
                <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-600">
                  <ExternalLink size={11} />
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="ml-8 flex gap-3 mt-1 flex-wrap">
        {step.duration && (
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Clock size={11} /> {step.duration}
          </span>
        )}
        {step.downloadSize && (
          <span className="text-xs text-gray-400">📦 {step.downloadSize}</span>
        )}
      </div>
    </div>
  );
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onClose }) => {
  const { details } = task;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] flex flex-col shadow-2xl">

        {/* Header */}
        <div className={`p-4 border-b rounded-t-2xl sm:rounded-t-2xl`}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${TYPE_COLORS[task.type] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                  {TYPE_LABELS[task.type] || task.type}
                </span>
                <span className="text-xs text-gray-400">{task.time} · {task.duration} min · {task.points} pts</span>
              </div>
              <h2 className="text-base font-bold text-gray-900 leading-snug">{task.activity}</h2>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 flex-shrink-0">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 p-4 space-y-5">

          {/* General description */}
          {(task.description || details?.description) && (
            <div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {task.description || details?.description as string}
              </p>
            </div>
          )}

          {/* Objective */}
          {details?.objective && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target size={15} className="text-indigo-600" />
                <h3 className="text-sm font-semibold text-gray-800">Objectif</h3>
              </div>
              <p className="text-sm text-gray-700 bg-indigo-50 rounded-lg px-3 py-2 border border-indigo-100">
                {details.objective as string}
              </p>
            </div>
          )}

          {/* Expected outcome */}
          {details?.expectedOutcome && (
            <div className="flex items-start gap-2 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
              <CheckCircle2 size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-green-800">{details.expectedOutcome as string}</p>
            </div>
          )}

          {/* Steps / Mini-activités */}
          {details?.steps && Array.isArray(details.steps) && details.steps.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ListChecks size={15} className="text-indigo-600" />
                <h3 className="text-sm font-semibold text-gray-800">Étapes à suivre</h3>
              </div>
              <div className="space-y-2">
                {(details.steps as Array<string | TaskStep>).map((step, i) => (
                  <StepBlock key={i} step={step} />
                ))}
              </div>
            </div>
          )}

          {/* Time breakdown */}
          {details?.breakdown && typeof details.breakdown === 'object' && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock size={15} className="text-indigo-600" />
                <h3 className="text-sm font-semibold text-gray-800">Répartition du temps</h3>
              </div>
              <div className="grid gap-1.5">
                {Object.entries(details.breakdown as Record<string, string>).map(([key, value]) => (
                  <div key={key} className="flex items-start gap-2 text-sm">
                    <span className="text-gray-400 capitalize min-w-[100px] flex-shrink-0">{key.replace(/_/g, ' ')}</span>
                    <span className="text-gray-700">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Learning objectives */}
          {details?.learningObjectives && Array.isArray(details.learningObjectives) && details.learningObjectives.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen size={15} className="text-indigo-600" />
                <h3 className="text-sm font-semibold text-gray-800">Ce que tu vas apprendre / maîtriser</h3>
              </div>
              <ul className="space-y-1.5">
                {(details.learningObjectives as string[]).map((obj, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-indigo-400 mt-0.5 flex-shrink-0">◆</span>
                    {obj}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Success criteria */}
          {details?.successCriteria && Array.isArray(details.successCriteria) && details.successCriteria.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={15} className="text-green-600" />
                <h3 className="text-sm font-semibold text-gray-800">Critères de réussite</h3>
              </div>
              <ul className="space-y-1.5">
                {(details.successCriteria as string[]).map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                    <span className="text-gray-700">{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tools */}
          {details?.tools && Array.isArray(details.tools) && details.tools.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Wrench size={15} className="text-indigo-600" />
                <h3 className="text-sm font-semibold text-gray-800">Outils recommandés</h3>
              </div>
              <div className="space-y-2">
                {(details.tools as any[]).map((tool, i) => (
                  <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-800">{tool.tool || tool.name}</span>
                        {tool.cost && (
                          <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">
                            {tool.cost}
                          </span>
                        )}
                      </div>
                      {tool.use && <p className="text-xs text-gray-500 mt-0.5">{tool.use}</p>}
                      {tool.benefit && <p className="text-xs text-indigo-500">{tool.benefit}</p>}
                    </div>
                    {tool.url && (
                      <a href={tool.url} target="_blank" rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-700 flex-shrink-0 mt-0.5">
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Session info (for Anglais tasks) */}
          {(details?.sessionType || details?.platform || details?.focusToday) && (
            <div className="bg-green-50 border border-green-100 rounded-lg p-3 space-y-1">
              {details.sessionType && (
                <p className="text-xs font-semibold text-green-800">{details.sessionType as string}</p>
              )}
              {details.platform && (
                <p className="text-xs text-green-700">📍 {details.platform as string}</p>
              )}
              {details.focusToday && (
                <p className="text-xs text-green-700">🎯 {details.focusToday as string}</p>
              )}
              {details.topicDiscussion && (
                <p className="text-xs text-green-700">💬 {details.topicDiscussion as string}</p>
              )}
            </div>
          )}

          {/* Empty state */}
          {!details && !task.description && (
            <div className="text-center py-8 text-gray-400">
              <BookOpen size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">Aucun détail disponible pour cette tâche.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 text-sm"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
