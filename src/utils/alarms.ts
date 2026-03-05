import type { Alarm, Task } from '../types';
import { showNotification } from './notifications';
import { speak } from './speech';

export class AlarmEngine {
  private static checkInterval: number | null = null;

  static start(alarms: Alarm[], tasks: Task[]) {
    this.stop();

    this.checkInterval = window.setInterval(() => {
      this.checkAlarms(alarms, tasks);
    }, 30000);
  }

  static stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  private static checkAlarms(alarms: Alarm[], tasks: Task[]) {
    const now = new Date();

    alarms.forEach(alarm => {
      if (alarm.triggered || alarm.notificationSent) return;

      if (now >= alarm.scheduledTime) {
        const task = tasks.find(t => t.id === alarm.taskId);
        if (!task) return;

        this.triggerAlarm(alarm, task);
      }
    });
  }

  private static triggerAlarm(alarm: Alarm, task: Task) {
    alarm.triggered = true;

    const title = alarm.type === 'reminder'
      ? '⏰ Dans 5 minutes'
      : '🎯 C\'EST L\'HEURE !';

    const body = alarm.type === 'reminder'
      ? `Prochaine tâche : ${task.activity}`
      : `${task.activity} - ${task.duration} minutes`;

    showNotification(title, body, task.id);

    if (alarm.type === 'reminder') {
      speak(`Dans 5 minutes : ${task.activity}. Durée estimée : ${task.duration} minutes.`);
    } else {
      speak(`C'est l'heure ! ${task.activity}. Durée : ${task.duration} minutes. Bonne chance !`);
    }

    alarm.notificationSent = true;
  }
}
