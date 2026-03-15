"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useStore } from "@/store/useStore";
import Link from "next/link";

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(
    format(new Date(), "yyyy-MM-dd")
  );
  const tasks = useStore((s) => s.tasks);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const weeks: Date[][] = [];
  let day = startDate;
  while (day <= endDate) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(day);
      day = addDays(day, 1);
    }
    weeks.push(week);
  }

  const getTaskCount = (date: Date) => {
    const d = format(date, "yyyy-MM-dd");
    return tasks.filter((t) => t.dueDate === d).length;
  };

  const getCompletedCount = (date: Date) => {
    const d = format(date, "yyyy-MM-dd");
    return tasks.filter((t) => t.dueDate === d && t.status === "done").length;
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-5 sm:p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-xl font-semibold text-text-primary sm:text-2xl">Calendar</h1>
          <p className="mt-1 text-text-secondary">
            Click a day to view tasks
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="rounded-xl p-2 text-text-secondary hover:bg-surface-muted hover:text-text-primary"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="min-w-[140px] text-center font-medium text-text-primary">
            {format(currentMonth, "MMMM yyyy")}
          </span>
          <button
            type="button"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="rounded-xl p-2 text-text-secondary hover:bg-surface-muted hover:text-text-primary"
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05 }}
        className="overflow-hidden rounded-2xl border border-border bg-surface-elevated"
      >
        <div className="grid grid-cols-7 border-b border-border bg-surface-muted/50">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div
              key={d}
              className="py-3 text-center text-xs font-medium text-text-tertiary"
            >
              {d}
            </div>
          ))}
        </div>
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7">
            {week.map((date) => {
              const dateStr = format(date, "yyyy-MM-dd");
              const count = getTaskCount(date);
              const completed = getCompletedCount(date);
              const inMonth = isSameMonth(date, currentMonth);
              const selected = selectedDate === dateStr;
              const today = isToday(date);
              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => setSelectedDate(dateStr)}
                  className={`
                    relative min-h-[64px] sm:min-h-[80px] border-b border-r border-border p-1.5 sm:p-2 text-left transition-colors
                    last:border-r-0
                    ${!inMonth ? "bg-surface-muted/30 text-text-tertiary" : "bg-surface-elevated hover:bg-surface-muted/50"}
                    ${selected ? "ring-2 ring-inset ring-accent" : ""}
                    ${today ? "font-semibold text-accent" : ""}
                  `}
                >
                  <span className={today ? "text-accent" : "text-text-primary"}>
                    {format(date, "d")}
                  </span>
                  {count > 0 && (
                    <div className="mt-1 flex gap-0.5">
                      <span className="text-xs text-text-secondary">
                        {completed}/{count}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </motion.div>

      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-2xl border border-border bg-surface-elevated p-4 sm:p-6"
        >
          <h2 className="mb-4 font-semibold text-text-primary">
            {format(new Date(selectedDate), "EEEE, MMMM d")}
          </h2>
          {tasks.filter((t) => t.dueDate === selectedDate).length === 0 ? (
            <p className="text-text-secondary">No tasks on this day.</p>
          ) : (
            <ul className="space-y-2">
              {tasks
                .filter((t) => t.dueDate === selectedDate)
                .sort((a, b) => a.order - b.order)
                .map((t) => (
                  <li key={t.id}>
                    <Link
                      href={`/app/planner?date=${selectedDate}`}
                      className="flex items-center justify-between rounded-lg py-2 px-3 hover:bg-surface-muted"
                    >
                      <span
                        className={
                          t.status === "done"
                            ? "text-text-tertiary line-through"
                            : "text-text-primary"
                        }
                      >
                        {t.title}
                      </span>
                      <span
                        className={`text-xs capitalize ${
                          t.status === "done"
                            ? "text-green-500"
                            : "text-text-tertiary"
                        }`}
                      >
                        {t.status.replace("_", " ")}
                      </span>
                    </Link>
                  </li>
                ))}
            </ul>
          )}
        </motion.div>
      )}
    </div>
  );
}
