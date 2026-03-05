import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import type { Planning, Week, Task } from '../types';

export class UniversalParser {
  static async parseFile(file: File): Promise<Planning> {
    const extension = file.name.split('.').pop()?.toLowerCase();

    switch (extension) {
      case 'json':
        return this.parseJSON(file);
      case 'csv':
        return this.parseCSV(file);
      case 'xlsx':
      case 'xls':
        return this.parseExcel(file);
      case 'txt':
        return this.parseText(file);
      default:
        throw new Error(`Format non supporté: ${extension}`);
    }
  }

  private static async parseJSON(file: File): Promise<Planning> {
    const text = await file.text();
    const data = JSON.parse(text);

    if (!data.weeks || !Array.isArray(data.weeks)) {
      throw new Error('Structure JSON invalide');
    }

    return {
      id: crypto.randomUUID(),
      title: data.title || 'Planning Importé',
      description: data.description,
      startDate: new Date(data.startDate || Date.now()),
      totalWeeks: data.weeks.length,
      weeks: data.weeks.map((w: any) => this.normalizeWeek(w)),
      metadata: data.metadata,
    };
  }

  private static async parseCSV(file: File): Promise<Planning> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          try {
            const planning = this.buildPlanningFromRows(results.data);
            resolve(planning);
          } catch (error) {
            reject(error);
          }
        },
        error: reject,
      });
    });
  }

  private static async parseExcel(file: File): Promise<Planning> {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    return this.buildPlanningFromRows(data);
  }

  private static async parseText(file: File): Promise<Planning> {
    const text = await file.text();
    const lines = text.split('\n').filter(l => l.trim());

    const weeks: Week[] = [];
    let currentWeek: Week | null = null;

    lines.forEach(line => {
      if (line.match(/^Semaine (\d+)/i)) {
        if (currentWeek) weeks.push(currentWeek);
        currentWeek = {
          number: parseInt(line.match(/\d+/)![0]),
          title: line,
          focus: '',
          tasks: [],
        };
      } else if (currentWeek && line.match(/^\d{2}:\d{2}/)) {
        const task = this.parseTaskLine(line, currentWeek.number);
        if (task) currentWeek.tasks.push(task);
      }
    });

    if (currentWeek) weeks.push(currentWeek);

    return {
      id: crypto.randomUUID(),
      title: 'Planning Texte Importé',
      startDate: new Date(),
      totalWeeks: weeks.length,
      weeks,
    };
  }

  private static buildPlanningFromRows(rows: any[]): Planning {
    const weekMap = new Map<number, Week>();

    rows.forEach((row: any) => {
      const weekNum = parseInt(row.week || row.semaine || 1);

      if (!weekMap.has(weekNum)) {
        weekMap.set(weekNum, {
          number: weekNum,
          title: row.weekTitle || `Semaine ${weekNum}`,
          focus: row.focus || '',
          certification: row.certification,
          tasks: [],
        });
      }

      const task: Task = {
        id: crypto.randomUUID(),
        weekNumber: weekNum,
        date: new Date(row.date || Date.now()),
        time: row.time || row.heure || '00:00',
        endTime: row.endTime,
        activity: row.activity || row.activité || row.task || '',
        duration: parseInt(row.duration || row.durée || 0),
        type: this.normalizeType(row.type),
        points: parseInt(row.points || 0),
        completed: false,
      };

      weekMap.get(weekNum)!.tasks.push(task);
    });

    const weeks = Array.from(weekMap.values()).sort((a, b) => a.number - b.number);

    return {
      id: crypto.randomUUID(),
      title: 'Planning Importé',
      startDate: new Date(),
      totalWeeks: weeks.length,
      weeks,
    };
  }

  private static normalizeWeek(week: any): Week {
    return {
      number: week.number || week.week || 1,
      title: week.title || week.phase || '',
      focus: week.focus || '',
      certification: week.certification || week.certif,
      deliverable: week.deliverable,
      tasks: (week.tasks || week.dailyTasks || []).map((t: any) => this.normalizeTask(t)),
    };
  }

  private static normalizeTask(task: any): Task {
    return {
      id: task.id || crypto.randomUUID(),
      weekNumber: task.weekNumber || task.week || 1,
      date: new Date(task.date || Date.now()),
      time: task.time || '00:00',
      endTime: task.endTime,
      activity: task.activity || task.description || '',
      duration: parseInt(task.duration || 0),
      type: this.normalizeType(task.type),
      points: parseInt(task.points || 0),
      completed: task.completed || false,
      imprevuReason: task.imprevuReason,
    };
  }

  private static normalizeType(type: string): Task['type'] {
    const normalized = type?.toLowerCase() || 'autre';
    const validTypes: Task['type'][] = ['memoire', 'certif', 'anglais', 'finance', 'sport', 'autre'];
    return validTypes.includes(normalized as any) ? normalized as Task['type'] : 'autre';
  }

  private static parseTaskLine(line: string, weekNum: number): Task | null {
    const match = line.match(/^(\d{2}:\d{2})\s*-\s*(.+?)\s*\((\d+)min,\s*(\w+),\s*(\d+)pts\)/);
    if (!match) return null;

    return {
      id: crypto.randomUUID(),
      weekNumber: weekNum,
      date: new Date(),
      time: match[1],
      activity: match[2].trim(),
      duration: parseInt(match[3]),
      type: this.normalizeType(match[4]),
      points: parseInt(match[5]),
      completed: false,
    };
  }
}
