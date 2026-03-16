"use client";

import { motion } from "framer-motion";

const MOODS = [
  { emoji: "😊", label: "Great" },
  { emoji: "🙂", label: "Good" },
  { emoji: "😐", label: "Okay" },
  { emoji: "😕", label: "Low" },
  { emoji: "😢", label: "Bad" },
];

interface MoodSelectorProps {
  value: string | null;
  onChange: (emoji: string) => void;
  className?: string;
}

export function MoodSelector({ value, onChange, className = "" }: MoodSelectorProps) {
  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {MOODS.map(({ emoji, label }) => {
        const isSelected = value === emoji;
        return (
          <motion.button
            key={emoji}
            type="button"
            onClick={() => onChange(isSelected ? "" : emoji)}
            className={`flex h-9 w-9 items-center justify-center rounded-xl text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent/40 ${
              isSelected
                ? "bg-accent-subtle ring-2 ring-accent/30"
                : "bg-surface-muted text-text-secondary hover:bg-border hover:text-text-primary"
            }`}
            whileTap={{ scale: 0.95 }}
            aria-label={label}
            aria-pressed={isSelected}
          >
            {emoji}
          </motion.button>
        );
      })}
    </div>
  );
}
