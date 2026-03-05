import { create } from 'zustand';
import type { Planning, Task, TaskAction, Stats, Alarm } from '../types';

interface PlanningState {
  planning: Planning | null;
  currentWeek: number;
  tasks: Task[];
  actions: TaskAction[];
  alarms: Alarm[];
  stats: Stats;

  loadPlanning: (planning: Planning) => void;
  setCurrentWeek: (week: number) => void;
  addTask: (task: Omit<Task, 'id'>, justification: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>, justification: string) => void;
  deleteTask: (taskId: string, justification: string) => void;
  toggleTask: (taskId: string) => void;
  createAlarms: () => void;
  calculateStats: () => void;
}

const LEVELS = [
  { min: 0, label: 'Apprenti' },
  { min: 100, label: 'Disciple' },
  { min: 300, label: 'Pratiquant' },
  { min: 600, label: 'Expert' },
  { min: 1000, label: 'Maître' },
];

function getLevel(points: number): string {
  let level = 'Apprenti';
  for (const l of LEVELS) {
    if (points >= l.min) level = l.label;
  }
  return level;
}

function calculateStreak(tasks: Task[]): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let streak = 0;
  let checkDate = new Date(today);

  while (true) {
    const dayTasks = tasks.filter(t => {
      const d = new Date(t.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === checkDate.getTime();
    });
    if (dayTasks.length === 0) break;
    const allDone = dayTasks.every(t => t.completed);
    if (!allDone) break;
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }
  return streak;
}

export const usePlanningStore = create<PlanningState>((set, get) => ({
  planning: null,
  currentWeek: 1,
  tasks: [],
  actions: [],
  alarms: [],
  stats: {
    totalPoints: 0,
    completionRate: 0,
    streak: 0,
    level: 'Apprenti',
    tasksCompleted: 0,
    tasksTotal: 0,
  },

  loadPlanning: (planning) => {
    set({
      planning,
      tasks: planning.weeks.flatMap(w => w.tasks),
      currentWeek: 1,
    });
    get().createAlarms();
    get().calculateStats();
  },

  setCurrentWeek: (week) => set({ currentWeek: week }),

  addTask: (task, justification) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      completed: false,
    };

    const action: TaskAction = {
      id: crypto.randomUUID(),
      action: 'create',
      taskId: newTask.id,
      timestamp: new Date(),
      justification,
      newState: newTask,
    };

    set(state => ({
      tasks: [...state.tasks, newTask],
      actions: [...state.actions, action],
    }));

    get().createAlarms();
    get().calculateStats();
  },

  updateTask: (taskId, updates, justification) => {
    const task = get().tasks.find(t => t.id === taskId);
    if (!task) return;

    const action: TaskAction = {
      id: crypto.randomUUID(),
      action: 'update',
      taskId,
      timestamp: new Date(),
      justification,
      previousState: task,
      newState: { ...task, ...updates },
    };

    set(state => ({
      tasks: state.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t),
      actions: [...state.actions, action],
    }));

    get().calculateStats();
  },

  deleteTask: (taskId, justification) => {
    const task = get().tasks.find(t => t.id === taskId);
    if (!task) return;

    const action: TaskAction = {
      id: crypto.randomUUID(),
      action: 'delete',
      taskId,
      timestamp: new Date(),
      justification,
      previousState: task,
    };

    set(state => ({
      tasks: state.tasks.filter(t => t.id !== taskId),
      actions: [...state.actions, action],
      alarms: state.alarms.filter(a => a.taskId !== taskId),
    }));

    get().calculateStats();
  },

  toggleTask: (taskId) => {
    set(state => ({
      tasks: state.tasks.map(t =>
        t.id === taskId
          ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date() : undefined }
          : t
      ),
    }));
    get().calculateStats();
  },

  createAlarms: () => {
    const tasks = get().tasks;
    const alarms: Alarm[] = [];

    tasks.forEach(task => {
      const taskDate = new Date(task.date);
      const [hours, minutes] = task.time.split(':');
      taskDate.setHours(parseInt(hours), parseInt(minutes), 0);

      const reminderTime = new Date(taskDate.getTime() - 5 * 60 * 1000);
      alarms.push({
        id: crypto.randomUUID(),
        taskId: task.id,
        type: 'reminder',
        scheduledTime: reminderTime,
        triggered: false,
        notificationSent: false,
      });

      alarms.push({
        id: crypto.randomUUID(),
        taskId: task.id,
        type: 'start',
        scheduledTime: taskDate,
        triggered: false,
        notificationSent: false,
      });
    });

    set({ alarms });
  },

  calculateStats: () => {
    const tasks = get().tasks;
    const completed = tasks.filter(t => t.completed);

    const stats: Stats = {
      totalPoints: completed.reduce((sum, t) => sum + t.points, 0),
      completionRate: tasks.length > 0 ? (completed.length / tasks.length) * 100 : 0,
      streak: calculateStreak(tasks),
      level: getLevel(completed.reduce((sum, t) => sum + t.points, 0)),
      tasksCompleted: completed.length,
      tasksTotal: tasks.length,
    };

    set({ stats });
  },
}));
