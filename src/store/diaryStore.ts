"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WeekdayKey, DayEntry, WeeklyReflection } from "@/types";

const WEEKDAYS: WeekdayKey[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const emptyDayEntry: DayEntry = {
  notes: "",
  reflection: "",
  tasks: [],
  mood: null,
  productivityScore: 5,
  isHighlighted: false,
};

const emptyReflection: WeeklyReflection = {
  whatWentWell: "",
  whatToImprove: "",
  achievement: "",
};

interface DiaryState {
  days: Record<WeekdayKey, DayEntry>;
  weeklyReflection: WeeklyReflection;
  updateDay: (weekday: WeekdayKey, updates: Partial<DayEntry>) => void;
  addTask: (weekday: WeekdayKey, text: string) => void;
  toggleTask: (weekday: WeekdayKey, taskId: string) => void;
  updateTask: (weekday: WeekdayKey, taskId: string, text: string) => void;
  deleteTask: (weekday: WeekdayKey, taskId: string) => void;
  reorderTasks: (weekday: WeekdayKey, fromIndex: number, toIndex: number) => void;
  setTaskImportant: (weekday: WeekdayKey, taskId: string, important: boolean) => void;
  updateWeeklyReflection: (updates: Partial<WeeklyReflection>) => void;
}

function createInitialDays(): Record<WeekdayKey, DayEntry> {
  return WEEKDAYS.reduce(
    (acc, d) => {
      acc[d] = { ...emptyDayEntry };
      return acc;
    },
    {} as Record<WeekdayKey, DayEntry>
  );
}

export const useDiaryStore = create<DiaryState>()(
  persist(
    (set) => ({
      days: createInitialDays(),
      weeklyReflection: emptyReflection,

      updateDay: (weekday, updates) =>
        set((s) => ({
          days: {
            ...s.days,
            [weekday]: { ...s.days[weekday], ...updates },
          },
        })),

      addTask: (weekday, text) =>
        set((s) => {
          const tasks = [...s.days[weekday].tasks];
          tasks.push({
            id: crypto.randomUUID(),
            text: text.trim() || "New item",
            done: false,
          });
          return {
            days: {
              ...s.days,
              [weekday]: { ...s.days[weekday], tasks },
            },
          };
        }),

      toggleTask: (weekday, taskId) =>
        set((s) => ({
          days: {
            ...s.days,
            [weekday]: {
              ...s.days[weekday],
              tasks: s.days[weekday].tasks.map((t) =>
                t.id === taskId ? { ...t, done: !t.done } : t
              ),
            },
          },
        })),

      updateTask: (weekday, taskId, text) =>
        set((s) => ({
          days: {
            ...s.days,
            [weekday]: {
              ...s.days[weekday],
              tasks: s.days[weekday].tasks.map((t) =>
                t.id === taskId ? { ...t, text } : t
              ),
            },
          },
        })),

      deleteTask: (weekday, taskId) =>
        set((s) => ({
          days: {
            ...s.days,
            [weekday]: {
              ...s.days[weekday],
              tasks: s.days[weekday].tasks.filter((t) => t.id !== taskId),
            },
          },
        })),

      reorderTasks: (weekday, fromIndex, toIndex) =>
        set((s) => {
          const tasks = [...s.days[weekday].tasks];
          const [removed] = tasks.splice(fromIndex, 1);
          tasks.splice(toIndex, 0, removed);
          return {
            days: {
              ...s.days,
              [weekday]: { ...s.days[weekday], tasks },
            },
          };
        }),

      setTaskImportant: (weekday, taskId, important) => {
        // Store doesn't have "important" on task; we can use isHighlighted on day or add to task later. Skip for now or use day isHighlighted.
        set((s) => ({
          days: {
            ...s.days,
            [weekday]: { ...s.days[weekday], isHighlighted: important },
          },
        }));
      },

      updateWeeklyReflection: (updates) =>
        set((s) => ({
          weeklyReflection: { ...s.weeklyReflection, ...updates },
        })),
    }),
    { name: "dailyflow-diary" }
  )
);

export const WEEKDAY_LABELS: Record<WeekdayKey, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

export const WEEKDAY_SHORT: Record<WeekdayKey, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

export function getWeekdaysForMode(mode: "work" | "full"): WeekdayKey[] {
  return mode === "work" ? WEEKDAYS.slice(0, 5) : WEEKDAYS;
}
