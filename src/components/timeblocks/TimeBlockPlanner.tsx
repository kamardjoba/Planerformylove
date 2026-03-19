"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { WeekGrid } from "./WeekGrid";
import { DayView } from "./DayView";
import { BlockModal } from "./BlockModal";
import type { TimeBlock } from "@/types";

export function TimeBlockPlanner() {
  const [viewMode, setViewMode] = useState<"week" | "day">("week");
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [quickAddDay, setQuickAddDay] = useState<number | null>(null);
  const [editingBlock, setEditingBlock] = useState<TimeBlock | null>(null);

  const openDayView = (dayIndex: number) => {
    setSelectedDayIndex(dayIndex);
    setViewMode("day");
  };

  const openQuickAdd = (dayIndex: number) => {
    setQuickAddDay(dayIndex);
  };

  return (
    <div className="relative flex min-h-0 flex-1 flex-col pb-14">
      <AnimatePresence mode="wait">
        {viewMode === "week" ? (
          <motion.div
            key="week"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-0 flex-1 flex-col gap-3"
          >
            <WeekGrid onSelectDay={openDayView} />
            <p className="shrink-0 text-center text-xs text-text-tertiary">
              Tap a day or a block to open the day view
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="day"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: "spring", damping: 25 }}
            className="-mx-4 w-[calc(100%+2rem)] min-h-0 flex-1 overflow-hidden sm:-mx-6 sm:w-[calc(100%+3rem)] md:-mx-8 md:w-[calc(100%+4rem)]"
          >
            <DayView
              dayIndex={selectedDayIndex}
              onBack={() => setViewMode("week")}
              onPrevDay={() =>
                setSelectedDayIndex((d) => Math.max(0, d - 1))
              }
              onNextDay={() =>
                setSelectedDayIndex((d) => Math.min(4, d + 1))
              }
              onEditBlock={setEditingBlock}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {viewMode === "week" && (
        <div className="fixed bottom-20 right-4 md:bottom-8 md:right-8">
          <button
            type="button"
            onClick={() => openQuickAdd(0)}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg hover:opacity-90 active:scale-95"
            aria-label="Quick add block"
            title="Quick add"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
      )}

      {viewMode === "day" && (
        <div className="fixed bottom-20 right-4 md:bottom-8 md:right-8">
          <button
            type="button"
            onClick={() => openQuickAdd(selectedDayIndex)}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg hover:opacity-90 active:scale-95"
            aria-label="Quick add block"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
      )}

      {quickAddDay !== null && (
        <BlockModal
          block={null}
          dayIndex={quickAddDay}
          onClose={() => setQuickAddDay(null)}
        />
      )}
      {editingBlock && (
        <BlockModal
          block={editingBlock}
          dayIndex={editingBlock.dayIndex}
          onClose={() => setEditingBlock(null)}
        />
      )}
    </div>
  );
}
