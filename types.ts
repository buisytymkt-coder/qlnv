export enum TaskStatus {
  Pending = 'pending',
  Achieved = 'achieved',
  Failed = 'failed',
}

export enum DayOfWeek {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}

export interface Task {
  id: string;
  title: string;
  kpi: string;
  schedule: 'daily' | DayOfWeek[];
}

export interface ChecklistData {
  [date: string]: {
    [taskId: string]: {
      status: TaskStatus;
    };
  };
}

export interface AuditLogEntry {
    id: string;
    timestamp: Date;
    user: string;
    action: string;
    details: string;
}
