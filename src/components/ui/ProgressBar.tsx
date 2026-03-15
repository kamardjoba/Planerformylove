"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  showLabel = true,
  className = "",
}: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={className}>
      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full rounded-full bg-accent"
        />
      </div>
      {showLabel && (
        <p className="mt-1.5 text-sm text-text-secondary">
          {value} of {max} completed
        </p>
      )}
    </div>
  );
}
