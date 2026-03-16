"use client";

interface WeekModeSelectorProps {
  value: "work" | "full";
  onChange: (mode: "work" | "full") => void;
  className?: string;
}

export function WeekModeSelector({
  value,
  onChange,
  className = "",
}: WeekModeSelectorProps) {
  return (
    <div className={`flex gap-3 ${className}`}>
      <button
        type="button"
        onClick={() => onChange("work")}
        className={`flex-1 rounded-xl border-2 py-3 text-sm font-medium transition-colors ${
          value === "work"
            ? "border-accent bg-accent-subtle text-accent"
            : "border-border bg-surface-muted text-text-secondary hover:border-border"
        }`}
      >
        Mon – Fri
      </button>
      <button
        type="button"
        onClick={() => onChange("full")}
        className={`flex-1 rounded-xl border-2 py-3 text-sm font-medium transition-colors ${
          value === "full"
            ? "border-accent bg-accent-subtle text-accent"
            : "border-border bg-surface-muted text-text-secondary hover:border-border"
        }`}
      >
        Mon – Sun
      </button>
    </div>
  );
}
