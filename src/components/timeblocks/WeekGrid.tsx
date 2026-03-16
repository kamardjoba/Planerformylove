"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  useTimeBlockStore,
  DAY_LABELS,
  HOUR_START,
  HOUR_END,
  COLOR_MAP,
} from "@/store/timeBlockStore";
import type { TimeBlock } from "@/types";

const ROWS = HOUR_END - HOUR_START;
const ROW_HEIGHT = 18;
const TOTAL_MINUTES = ROWS * 60;
const START_BASE = HOUR_START * 60;

interface WeekGridProps {
  onSelectDay: (dayIndex: number) => void;
}

export function WeekGrid({ onSelectDay }: WeekGridProps) {
  const blocks = useTimeBlockStore((s) => s.blocks);

  const blocksByDay = useMemo(() => {
    const byDay: TimeBlock[][] = [[], [], [], [], []];
    blocks.forEach((b) => {
      if (b.dayIndex >= 0 && b.dayIndex < 5) byDay[b.dayIndex].push(b);
    });
    byDay.forEach((arr) => arr.sort((a, b) => a.startMinutes - b.startMinutes));
    return byDay;
  }, [blocks]);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-soft">
      <div className="flex border-b border-border bg-surface-muted/60">
        <div className="w-9 shrink-0" />
        {DAY_LABELS.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => onSelectDay(i)}
            className="flex flex-1 items-center justify-center py-2 text-xs font-medium text-text-secondary active:bg-surface-muted"
          >
            {label}
          </button>
        ))}
      </div>
      <div className="flex" style={{ height: ROWS * ROW_HEIGHT }}>
        <div className="flex w-9 shrink-0 flex-col border-r border-border">
          {Array.from({ length: ROWS }, (_, i) => (
            <div
              key={i}
              className="flex items-center justify-end pr-1 text-[10px] text-text-tertiary"
              style={{ height: ROW_HEIGHT }}
            >
              {HOUR_START + i}
            </div>
          ))}
        </div>
        {[0, 1, 2, 3, 4].map((dayIndex) => (
          <div
            key={dayIndex}
            className="relative flex-1 border-r border-border last:border-r-0"
            style={{
              height: ROWS * ROW_HEIGHT,
              backgroundImage: `repeating-linear-gradient(to bottom, transparent, transparent ${ROW_HEIGHT - 1}px, var(--border) ${ROW_HEIGHT - 1}px, var(--border) ${ROW_HEIGHT}px)`,
            }}
          >
            {blocksByDay[dayIndex].map((block) => {
              const topPct =
                ((block.startMinutes - START_BASE) / TOTAL_MINUTES) * 100;
              const heightPct =
                ((block.endMinutes - block.startMinutes) / TOTAL_MINUTES) * 100;
              const colorClass = COLOR_MAP[block.color] || COLOR_MAP.indigo;
              return (
                <motion.button
                  key={block.id}
                  type="button"
                  layout
                  initial={false}
                  className={`absolute left-0.5 right-0.5 rounded ${colorClass} text-white shadow-sm`}
                  style={{
                    top: `${topPct}%`,
                    height: `${Math.max(heightPct, 5)}%`,
                    minHeight: 14,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectDay(dayIndex);
                  }}
                >
                  <span className="block truncate px-1 py-0.5 text-[10px] font-medium">
                    {block.title || "Block"}
                  </span>
                </motion.button>
              );
            })}
            <button
              type="button"
              onClick={() => onSelectDay(dayIndex)}
              className="absolute inset-0"
              aria-label={`Open ${DAY_LABELS[dayIndex]}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
