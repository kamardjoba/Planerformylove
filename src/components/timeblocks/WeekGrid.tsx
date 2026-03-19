"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  useTimeBlockStore,
  DAY_LABELS,
  HOUR_START,
  HOUR_END,
  TOTAL_MINUTES,
  hourToLabel,
  COLOR_HEX,
} from "@/store/timeBlockStore";
import type { TimeBlock } from "@/types";

const ROWS = HOUR_END - HOUR_START + 1;
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
    <div className="flex min-h-[calc(100vh-14rem)] flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-soft">
      <div className="flex shrink-0 border-b border-border bg-surface-muted/60">
        <div className="w-10 shrink-0" />
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
      <div className="flex min-h-0 flex-1">
        <div className="flex w-10 shrink-0 flex-col border-r border-border">
          {Array.from({ length: ROWS }, (_, i) => (
            <div
              key={i}
              className="flex flex-1 min-h-0 items-start justify-end pr-1 pt-1 text-[10px] text-text-tertiary leading-none"
            >
              {hourToLabel(HOUR_START + i)}
            </div>
          ))}
        </div>
        {[0, 1, 2, 3, 4].map((dayIndex) => (
          <div
            key={dayIndex}
            className="relative flex min-h-0 flex-1 flex-col border-r border-border last:border-r-0"
          >
            <div
              className="absolute inset-0 flex flex-col"
              style={{
                backgroundImage: `repeating-linear-gradient(to bottom, transparent, transparent calc(100% / ${ROWS} - 1px), var(--border) calc(100% / ${ROWS} - 1px), var(--border) calc(100% / ${ROWS}))`,
              }}
            />
            {blocksByDay[dayIndex].map((block) => {
              const topPct =
                ((block.startMinutes - START_BASE) / TOTAL_MINUTES) * 100;
              const heightPct =
                ((block.endMinutes - block.startMinutes) / TOTAL_MINUTES) * 100;
              const bgColor = COLOR_HEX[block.color] ?? COLOR_HEX.indigo;
              return (
                <motion.button
                  key={`${block.id}-${block.dayIndex}-${block.startMinutes}-${block.endMinutes}`}
                  type="button"
                  layout
                  initial={false}
                  className="absolute left-0.5 right-0.5 rounded text-white shadow-sm"
                  style={{
                    top: `${topPct}%`,
                    height: `${Math.max(heightPct, 5)}%`,
                    minHeight: 14,
                    backgroundColor: bgColor,
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
            {Array.from({ length: ROWS }, (_, i) => (
              <div key={i} className="min-h-0 flex-1" />
            ))}
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
