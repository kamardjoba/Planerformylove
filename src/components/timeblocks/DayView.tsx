"use client";

import { useRef, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { useTimeBlockStore, DAY_LABELS, HOUR_START, HOUR_END, minutesToLabel, hourToLabel } from "@/store/timeBlockStore";
import { BlockCard } from "./BlockCard";
import type { TimeBlock } from "@/types";

const ROW_HEIGHT = 48;
const ROWS = HOUR_END - HOUR_START + 1;
const TOTAL_MINUTES = (HOUR_END - HOUR_START) * 60;
const START_BASE = HOUR_START * 60;

interface DayViewProps {
  dayIndex: number;
  onBack: () => void;
  onPrevDay: () => void;
  onNextDay: () => void;
  onEditBlock?: (block: TimeBlock) => void;
}

export function DayView({
  dayIndex,
  onBack,
  onPrevDay,
  onNextDay,
  onEditBlock,
}: DayViewProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const moveBlock = useTimeBlockStore((s) => s.moveBlock);
  // Subscribe to actual blocks for this day, so UI re-renders after drag/drop.
  const blocks = useTimeBlockStore((s) =>
    s.blocks
      .filter((b) => b.dayIndex === dayIndex)
      .sort((a, b) => a.startMinutes - b.startMinutes)
  );

  const handleBlockDragEnd = useCallback(
    (block: TimeBlock, newStartMinutes: number) => {
      const duration = block.endMinutes - block.startMinutes;
      const newEnd = Math.min(24 * 60, newStartMinutes + duration);
      moveBlock(block.id, dayIndex, newStartMinutes, newEnd);
    },
    [dayIndex, moveBlock]
  );

  const [swipeX, setSwipeX] = useState(0);
  const handleHeaderSwipeEnd = useCallback(
    (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
      setSwipeX(0);
      if (info.offset.x < -50 || info.velocity.x < -300) onNextDay();
      else if (info.offset.x > 50 || info.velocity.x > 300) onPrevDay();
    },
    [onNextDay, onPrevDay]
  );

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="flex items-center justify-between gap-2 border-b border-border bg-surface-elevated px-2 py-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 rounded-xl p-2 text-text-secondary hover:bg-surface-muted hover:text-text-primary"
          aria-label="Back to week"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm font-medium">Week</span>
        </button>
        <motion.div
          className="flex touch-none items-center gap-1"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDrag={(_, info) => setSwipeX(info.offset.x)}
          onDragEnd={handleHeaderSwipeEnd}
          style={{ x: swipeX }}
        >
          <button
            type="button"
            onClick={onPrevDay}
            className="rounded-xl p-2 text-text-secondary hover:bg-surface-muted hover:text-text-primary disabled:opacity-40"
            aria-label="Previous day"
            disabled={dayIndex <= 0}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="min-w-[72px] text-center text-sm font-semibold text-text-primary">
            {DAY_LABELS[dayIndex]}
          </span>
          <button
            type="button"
            onClick={onNextDay}
            className="rounded-xl p-2 text-text-secondary hover:bg-surface-muted hover:text-text-primary disabled:opacity-40"
            aria-label="Next day"
            disabled={dayIndex >= 4}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </motion.div>
        <div className="w-14" />
      </div>

      <div
        ref={timelineRef}
        id="day-timeline-height"
        className="relative flex-1 overflow-y-auto overflow-x-hidden overscroll-contain touch-pan-y [scrollbar-gutter:stable] [-webkit-overflow-scrolling:touch]"
        style={{ minHeight: 0 }}
      >
        <div
          id="day-block-area"
          className="relative"
          style={{ height: ROWS * ROW_HEIGHT, minHeight: ROWS * ROW_HEIGHT }}
        >
          {Array.from({ length: ROWS }, (_, i) => (
            <div
              key={i}
              className="flex border-b border-border/60"
              style={{ height: ROW_HEIGHT }}
            >
              <div className="w-12 shrink-0 py-1 text-xs text-text-tertiary">
                {hourToLabel(HOUR_START + i)}
              </div>
              <div className="flex-1" />
            </div>
          ))}
          <AnimatePresence>
            {blocks.map((block) => (
              <BlockCard
                key={block.id}
                block={block}
                timelineRef={timelineRef}
                onEdit={onEditBlock}
                onDragEnd={handleBlockDragEnd}
              />
            ))}
          </AnimatePresence>
        </div>
        {/* Extra scroll room below the last row so 24:00 can be scrolled above the "+" button */}
        <div style={{ height: 240 }} aria-hidden="true" />
      </div>
    </div>
  );
}
