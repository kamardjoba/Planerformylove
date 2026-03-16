"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import type { WeekdayKey } from "@/types";
import { useStore } from "@/store/useStore";
import { useDiaryStore, WEEKDAY_SHORT, getWeekdaysForMode } from "@/store/diaryStore";
import { DayCard } from "./DayCard";
import { ReflectionSection } from "./ReflectionSection";

export function WeeklyDiary() {
  const settings = useStore((s) => s.settings);
  const mode = settings.diaryWeekMode ?? "work";
  const weekdays = getWeekdaysForMode(mode);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToDay = (weekday: WeekdayKey) => {
    const el = document.getElementById(`day-${weekday}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={containerRef} className="min-h-full pb-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="flex items-center gap-2 text-xl font-semibold text-text-primary sm:text-2xl">
          <BookOpen className="h-6 w-6 text-accent" />
          Weekly Diary
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Notes by weekday. No dates — just your week template.
        </p>
        <p className="mt-0.5 text-xs text-text-tertiary">
          Showing {mode === "work" ? "Mon – Fri" : "Mon – Sun"} · Change in{" "}
          <Link href="/app/settings" className="text-accent hover:underline">
            Settings
          </Link>
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05 }}
        className="sticky top-14 z-10 -mx-1 mb-4 flex gap-1 overflow-x-auto pb-2 scrollbar-thin sm:gap-2"
      >
        {weekdays.map((weekday) => (
          <button
            key={weekday}
            type="button"
            onClick={() => scrollToDay(weekday)}
            className="shrink-0 rounded-xl border border-border bg-surface-elevated px-4 py-2.5 text-sm font-medium text-text-secondary shadow-soft transition-colors hover:border-accent/50 hover:bg-accent-subtle/50 hover:text-accent active:scale-[0.98]"
          >
            {WEEKDAY_SHORT[weekday]}
          </button>
        ))}
      </motion.div>

      <div className="space-y-6">
        {weekdays.map((weekday, index) => (
          <DayCard
            key={weekday}
            weekday={weekday}
            isFirst={index === 0}
          />
        ))}
        <ReflectionSection />
      </div>
    </div>
  );
}
