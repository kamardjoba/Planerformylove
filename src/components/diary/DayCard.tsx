"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { WeekdayKey } from "@/types";
import { useDiaryStore } from "@/store/diaryStore";
import { WEEKDAY_LABELS } from "@/store/diaryStore";
import { MoodSelector } from "./MoodSelector";
import { DiaryEditor } from "./DiaryEditor";
import { useStore } from "@/store/useStore";

interface DayCardProps {
  weekday: WeekdayKey;
  isFirst?: boolean;
}

export function DayCard({ weekday, isFirst }: DayCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const settings = useStore((s) => s.settings);
  const mode = settings.diaryWeekMode ?? "work";
  const day = useDiaryStore((s) => s.days[weekday]);
  const updateDay = useDiaryStore((s) => s.updateDay);
  const addTask = useDiaryStore((s) => s.addTask);
  const toggleTask = useDiaryStore((s) => s.toggleTask);
  const updateTask = useDiaryStore((s) => s.updateTask);
  const deleteTask = useDiaryStore((s) => s.deleteTask);

  if (!day) return null;

  const label = WEEKDAY_LABELS[weekday];

  return (
    <motion.section
      ref={cardRef}
      id={`day-${weekday}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="scroll-mt-24 rounded-2xl border border-border bg-surface-elevated p-4 shadow-soft transition-shadow hover:shadow-glass sm:p-5"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-text-primary sm:text-xl">
          {label}
        </h2>
        <button
          type="button"
          onClick={() =>
            updateDay(weekday, { isHighlighted: !day.isHighlighted })
          }
          className={`rounded-lg p-2 transition-colors ${
            day.isHighlighted
              ? "text-amber-500"
              : "text-text-tertiary hover:bg-surface-muted hover:text-text-secondary"
          }`}
          aria-label={day.isHighlighted ? "Unmark important" : "Mark important"}
          title="Important day"
        >
          <Star
            className="h-5 w-5"
            fill={day.isHighlighted ? "currentColor" : "none"}
          />
        </button>
      </div>

      <DiaryEditor
        notes={day.notes}
        onNotesChange={(notes) => updateDay(weekday, { notes })}
        tasks={day.tasks}
        onAddTask={(text) => addTask(weekday, text)}
        onToggleTask={(id) => toggleTask(weekday, id)}
        onUpdateTask={(id, text) => updateTask(weekday, id, text)}
        onDeleteTask={(id) => deleteTask(weekday, id)}
        reflection={day.reflection}
        onReflectionChange={(reflection) => updateDay(weekday, { reflection })}
        placeholder="Notes for today..."
      />

      <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-tertiary">
            Mood
          </label>
          <MoodSelector
            value={day.mood}
            onChange={(emoji) =>
              updateDay(weekday, { mood: emoji || null })
            }
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-text-tertiary">
            Productivity {day.productivityScore}/10
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={day.productivityScore}
            onChange={(e) =>
              updateDay(weekday, {
                productivityScore: parseInt(e.target.value, 10),
              })
            }
            className="h-2 w-full"
          />
        </div>
      </div>
    </motion.section>
  );
}
