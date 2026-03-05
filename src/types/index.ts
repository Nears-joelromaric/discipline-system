export interface Task {
  id: string;
  weekNumber: number;
  date: Date;
  time: string;
  endTime?: string;
  activity: string;
  duration: number;
  type: 'memoire' | 'certif' | 'anglais' | 'finance' | 'sport' | 'autre';
  points: number;
  completed: boolean;
  completedAt?: Date;
  imprevuReason?: string;
}

export interface TaskAction {
  id: string;
  action: 'create' | 'update' | 'delete';
  taskId: string;
  timestamp: Date;
  justification: string;
  previousState?: Task;
  newState?: Task;
}

export interface Week {
  number: number;
  title: string;
  focus: string;
  certification?: string;
  deliverable?: string;
  tasks: Task[];
}

export interface Planning {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  totalWeeks: number;
  weeks: Week[];
  metadata?: Record<string, any>;
}

export interface Alarm {
  id: string;
  taskId: string;
  type: 'reminder' | 'start' | 'end';
  scheduledTime: Date;
  triggered: boolean;
  notificationSent: boolean;
}

export interface Stats {
  totalPoints: number;
  completionRate: number;
  streak: number;
  level: string;
  tasksCompleted: number;
  tasksTotal: number;
}

export interface NotificationConfig {
  enabled: boolean;
  reminderMinutes: number;
  persistentReminders: boolean;
  sound: boolean;
  vibration: boolean;
}
