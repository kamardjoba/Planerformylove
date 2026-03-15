"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import type { Habit } from "@/types";

interface HabitStreakProps {
  habits: Habit[];
}

export function HabitStreak({ habits }: HabitStreakProps) {
  if (habits.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border bg-surface-elevated p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-text-secondary">
        <Flame className="h-4 w-4 text-amber-500" />
        Habits & streaks
      </h3>
      <div className="flex flex-wrap gap-3">
        {habits.map((h) => (
          <motion.div
            key={h.id}
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2 rounded-xl bg-surface-muted px-3 py-2"
          >
            <span className="text-lg">{h.emoji}</span>
            <div>
              <p className="text-sm font-medium text-text-primary">{h.name}</p>
              <p className="text-xs text-text-tertiary">
                {h.streak} day{h.streak !== 1 ? "s" : ""} streak
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
