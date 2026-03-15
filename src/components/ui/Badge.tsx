"use client";

type Priority = "low" | "medium" | "high";

const priorityStyles: Record<Priority, string> = {
  low: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  high: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

interface BadgeProps {
  priority: Priority;
  className?: string;
}

export function PriorityBadge({ priority, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-medium capitalize ${priorityStyles[priority]} ${className}`}
    >
      {priority}
    </span>
  );
}

export function TagBadge({
  tag,
  onRemove,
}: {
  tag: string;
  onRemove?: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-lg bg-surface-muted px-2 py-0.5 text-xs text-text-secondary">
      {tag}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="hover:text-text-primary"
          aria-label={`Remove ${tag}`}
        >
          ×
        </button>
      )}
    </span>
  );
}
