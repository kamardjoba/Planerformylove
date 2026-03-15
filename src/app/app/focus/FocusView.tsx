"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Play, Pause, RotateCcw, ListTodo } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store/useStore";

type Phase = "work" | "shortBreak" | "longBreak";

const PHASE_LABELS: Record<Phase, string> = {
  work: "Focus",
  shortBreak: "Short break",
  longBreak: "Long break",
};

export function FocusView() {
  const settings = useStore((s) => s.settings);
  const tasks = useStore((s) => s.getTasksForDate(format(new Date(), "yyyy-MM-dd")));
  const todoTasks = tasks.filter((t) => t.status !== "done");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(
    todoTasks[0]?.id ?? null
  );
  const [phase, setPhase] = useState<Phase>("work");
  const [secondsLeft, setSecondsLeft] = useState(settings.pomodoroMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);

  const getTotalSeconds = useCallback(() => {
    if (phase === "work") return settings.pomodoroMinutes * 60;
    if (phase === "shortBreak") return settings.shortBreakMinutes * 60;
    return settings.longBreakMinutes * 60;
  }, [phase, settings]);

  useEffect(() => {
    setSecondsLeft(getTotalSeconds());
  }, [phase, getTotalSeconds]);

  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [isRunning, secondsLeft]);

  useEffect(() => {
    if (secondsLeft === 0) {
      setIsRunning(false);
      if (phase === "work") {
        setPhase("shortBreak");
        setSecondsLeft(settings.shortBreakMinutes * 60);
      } else {
        setPhase("work");
        setSecondsLeft(settings.pomodoroMinutes * 60);
      }
    }
  }, [secondsLeft, phase, settings.shortBreakMinutes, settings.pomodoroMinutes]);

  const selectedTask = todoTasks.find((t) => t.id === selectedTaskId);
  const totalSecs = getTotalSeconds();
  const progress = totalSecs <= 0 ? 0 : 1 - secondsLeft / totalSecs;
  const strokeOffset = 283 - 283 * progress;

  const resetTimer = useCallback(() => {
    setSecondsLeft(getTotalSeconds());
  }, [getTotalSeconds]);

  return (
    <section className="mx-auto flex min-h-[80vh] max-w-2xl flex-col items-center justify-center px-4 py-6 sm:p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full text-center"
      >
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {(["work", "shortBreak", "longBreak"] as Phase[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                setPhase(p);
                setSecondsLeft(
                  p === "work"
                    ? settings.pomodoroMinutes * 60
                    : p === "shortBreak"
                    ? settings.shortBreakMinutes * 60
                    : settings.longBreakMinutes * 60
                );
                setIsRunning(false);
              }}
              className={
                phase === p
                  ? "rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white transition-colors"
                  : "rounded-xl bg-surface-muted px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-border"
              }
            >
              {PHASE_LABELS[p]}
            </button>
          ))}
        </div>

        <div className="relative mx-auto mb-6 flex h-48 w-48 items-center justify-center sm:mb-8 sm:h-56 sm:w-56">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="var(--surface-muted)"
              strokeWidth="6"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={283}
              initial={{ strokeDashoffset: 283 }}
              animate={{ strokeDashoffset: strokeOffset }}
              transition={{ duration: 0.5 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-semibold tabular-nums text-text-primary sm:text-4xl">
              {Math.floor(secondsLeft / 60)}:
              {(secondsLeft % 60).toString().padStart(2, "0")}
            </span>
            <span className="mt-1 text-sm text-text-tertiary">
              {PHASE_LABELS[phase]}
            </span>
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={() => setIsRunning(!isRunning)}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-soft transition-transform hover:scale-105 active:scale-95"
          >
            {isRunning ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="ml-1 h-6 w-6" />
            )}
          </button>
          <button
            type="button"
            onClick={resetTimer}
            className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-surface-elevated text-text-primary hover:bg-surface-muted"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
        </div>

        {todoTasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-12 rounded-2xl border border-border bg-surface-elevated p-6 text-left"
          >
            <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-text-secondary">
              <ListTodo className="h-4 w-4" />
              Current task
            </h3>
            <select
              value={selectedTaskId ?? ""}
              onChange={(e) => setSelectedTaskId(e.target.value || null)}
              className="w-full rounded-xl border border-border bg-surface-muted px-4 py-3 text-text-primary focus:border-accent focus:outline-none"
            >
              <option value="">Select a task...</option>
              {todoTasks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                  {t.dueTime ? " — " + t.dueTime : ""}
                </option>
              ))}
            </select>
            {selectedTask && (
              <p className="mt-2 text-sm text-text-secondary">
                {selectedTask.description || "No description"}
              </p>
            )}
            <Link
              href="/app/planner"
              className="mt-3 inline-block text-sm font-medium text-accent hover:underline"
            >
              Edit in Planner →
            </Link>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
