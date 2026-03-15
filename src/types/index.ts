export type Priority = "low" | "medium" | "high";
export type TaskStatus = "todo" | "in_progress" | "done";

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string; // ISO date
  dueTime?: string; // HH:mm
  tags: string[];
  status: TaskStatus;
  order: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  streak: number;
  completedDates: string[]; // ISO dates
  createdAt: string;
}

export interface DayStats {
  date: string;
  completed: number;
  total: number;
}

export interface UserSettings {
  darkMode: boolean;
  pomodoroMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  notifications: boolean;
}
