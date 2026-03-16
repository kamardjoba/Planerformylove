"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TimeBlock, TimeBlockColor } from "@/types";
import type { Priority } from "@/types";

const DEFAULT_START = 6 * 60;
const DEFAULT_END = 23 * 60;
const MIN_DURATION = 30;

interface TimeBlockState {
  blocks: TimeBlock[];
  addBlock: (block: Omit<TimeBlock, "id">) => void;
  updateBlock: (id: string, updates: Partial<TimeBlock>) => void;
  deleteBlock: (id: string) => void;
  moveBlock: (id: string, dayIndex: number, startMinutes: number, endMinutes: number) => void;
  resizeBlock: (id: string, endMinutes: number) => void;
  getBlocksForDay: (dayIndex: number) => TimeBlock[];
}

export const useTimeBlockStore = create<TimeBlockState>()(
  persist(
    (set, get) => ({
      blocks: [],

      addBlock: (block) => {
        const newBlock: TimeBlock = {
          ...block,
          id: crypto.randomUUID(),
        };
        set((s) => ({ blocks: [...s.blocks, newBlock] }));
      },

      updateBlock: (id, updates) => {
        set((s) => ({
          blocks: s.blocks.map((b) =>
            b.id === id ? { ...b, ...updates } : b
          ),
        }));
      },

      deleteBlock: (id) => {
        set((s) => ({ blocks: s.blocks.filter((b) => b.id !== id) }));
      },

      moveBlock: (id, dayIndex, startMinutes, endMinutes) => {
        const duration = Math.max(MIN_DURATION, endMinutes - startMinutes);
        set((s) => ({
          blocks: s.blocks.map((b) =>
            b.id === id
              ? {
                  ...b,
                  dayIndex,
                  startMinutes,
                  endMinutes: startMinutes + duration,
                }
              : b
          ),
        }));
      },

      resizeBlock: (id, endMinutes) => {
        set((s) => ({
          blocks: s.blocks.map((b) => {
            if (b.id !== id) return b;
            const start = b.startMinutes;
            const newEnd = Math.max(start + MIN_DURATION, endMinutes);
            return { ...b, endMinutes: newEnd };
          }),
        }));
      },

      getBlocksForDay: (dayIndex) => {
        return get()
          .blocks.filter((b) => b.dayIndex === dayIndex)
          .sort((a, b) => a.startMinutes - b.startMinutes);
      },
    }),
    { name: "dailyflow-timeblocks" }
  )
);

export const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
export const HOUR_START = 6;
export const HOUR_END = 23;
export const TOTAL_MINUTES = (HOUR_END - HOUR_START) * 60;

export function minutesToLabel(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export const COLOR_MAP: Record<TimeBlockColor, string> = {
  indigo: "bg-indigo-500/90",
  emerald: "bg-emerald-500/90",
  amber: "bg-amber-500/90",
  rose: "bg-rose-500/90",
  sky: "bg-sky-500/90",
  violet: "bg-violet-500/90",
};

export const COLOR_OPTIONS: Array<{ value: TimeBlockColor; label: string }> = [
  { value: "indigo", label: "Indigo" },
  { value: "emerald", label: "Emerald" },
  { value: "amber", label: "Amber" },
  { value: "rose", label: "Rose" },
  { value: "sky", label: "Sky" },
  { value: "violet", label: "Violet" }
];
