"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Task, Habit, UserSettings } from "@/types";
import { demoTasks, demoHabits } from "@/lib/demo-data";

const defaultSettings: UserSettings = {
  darkMode: false,
  pomodoroMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  notifications: true,
};

interface AppState {
  tasks: Task[];
  habits: Habit[];
  settings: UserSettings;
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt" | "order">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  reorderTasks: (date: string, fromIndex: number, toIndex: number) => void;
  toggleTaskComplete: (id: string) => void;
  addHabit: (habit: Omit<Habit, "id" | "createdAt">) => void;
  toggleHabitDate: (habitId: string, date: string) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  getTasksForDate: (date: string) => Task[];
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      tasks: demoTasks,
      habits: demoHabits,
      settings: defaultSettings,

      addTask: (task) => {
        const date = task.dueDate || new Date().toISOString().slice(0, 10);
        const tasksForDate = get().tasks.filter((t) => t.dueDate === date);
        const order = tasksForDate.length;
        const newTask: Task = {
          ...task,
          id: crypto.randomUUID(),
          order,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((s) => ({ tasks: [...s.tasks, newTask] }));
      },

      updateTask: (id, updates) => {
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id
              ? { ...t, ...updates, updatedAt: new Date().toISOString() }
              : t
          ),
        }));
      },

      deleteTask: (id) => {
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }));
      },

      reorderTasks: (date, fromIndex, toIndex) => {
        if (fromIndex === toIndex) return;
        set((s) => {
          const forDate = s.tasks.filter((t) => t.dueDate === date).sort((a, b) => a.order - b.order);
          const rest = s.tasks.filter((t) => t.dueDate !== date);
          const [removed] = forDate.splice(fromIndex, 1);
          forDate.splice(toIndex, 0, removed);
          const reordered = forDate.map((t, i) => ({ ...t, order: i }));
          return { tasks: [...rest, ...reordered] };
        });
      },

      toggleTaskComplete: (id) => {
        set((s) => ({
          tasks: s.tasks.map((t) => {
            if (t.id !== id) return t;
            const isDone = t.status === "done";
            return {
              ...t,
              status: isDone ? "todo" : "done",
              completedAt: isDone ? undefined : new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      addHabit: (habit) => {
        const newHabit: Habit = {
          ...habit,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ habits: [...s.habits, newHabit] }));
      },

      toggleHabitDate: (habitId, date) => {
        set((s) => ({
          habits: s.habits.map((h) => {
            if (h.id !== habitId) return h;
            const has = h.completedDates.includes(date);
            const completedDates = has
              ? h.completedDates.filter((d) => d !== date)
              : [...h.completedDates, date];
            const streak = has ? Math.max(0, h.streak - 1) : h.streak + 1;
            return { ...h, completedDates, streak };
          }),
        }));
      },

      updateSettings: (updates) => {
        set((s) => ({ settings: { ...s.settings, ...updates } }));
      },

      getTasksForDate: (date) => {
        return get()
          .tasks.filter((t) => t.dueDate === date)
          .sort((a, b) => a.order - b.order);
      },
    }),
    { name: "dailyflow-storage" }
  )
);
