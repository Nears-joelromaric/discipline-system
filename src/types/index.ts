export interface TaskStep {
  step?: number;
  action?: string;
  instructions?: string | string[];
  url?: string;
  platform?: string;
  duration?: string;
  downloadSize?: string;
  plugins?: Array<{ name: string; purpose: string; link?: string }>;
}

export interface TaskDetails {
  objective?: string;
  description?: string;
  steps?: Array<string | TaskStep>;
  learningObjectives?: string[];
  successCriteria?: string[];
  expectedOutcome?: string;
  tools?: Array<{ tool?: string; name?: string; url?: string; use?: string; cost?: string; benefit?: string }>;
  breakdown?: Record<string, string>;
  sessionType?: string;
  platform?: string;
  focusToday?: string;
  topicDiscussion?: string;
  modules?: Array<{ moduleNumber?: number; title?: string; startDate?: string; topics?: string[]; practicalActivity?: string }>;
  [key: string]: unknown;
}

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
  description?: string;
  details?: TaskDetails;
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
