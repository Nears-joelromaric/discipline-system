import Dexie from 'dexie';
import type { Table } from 'dexie';
import type { Planning, Task, TaskAction, Alarm } from '../types';

export class DisciplineDB extends Dexie {
  plannings!: Table<Planning>;
  tasks!: Table<Task>;
  actions!: Table<TaskAction>;
  alarms!: Table<Alarm>;

  constructor() {
    super('DisciplineDB');
    this.version(1).stores({
      plannings: '++id, title, startDate',
      tasks: '++id, weekNumber, date, completed',
      actions: '++id, taskId, timestamp',
      alarms: '++id, taskId, scheduledTime, triggered',
    });
  }
}

export const db = new DisciplineDB();
