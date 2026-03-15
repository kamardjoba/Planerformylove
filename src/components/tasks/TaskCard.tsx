"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, Clock, Trash2, GripVertical } from "lucide-react";
import type { Task } from "@/types";
import { PriorityBadge, TagBadge } from "@/components/ui/Badge";
import { useStore } from "@/store/useStore";
import { format } from "date-fns";
import { Button } from "@/components/ui/Button";

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  dragHandle?: React.ReactNode;
  compact?: boolean;
}

export function TaskCard({
  task,
  onEdit,
  dragHandle,
  compact = false,
}: TaskCardProps) {
  const [expanded, setExpanded] = useState(false);
  const toggleComplete = useStore((s) => s.toggleTaskComplete);
  const deleteTask = useStore((s) => s.deleteTask);
  const updateTask = useStore((s) => s.updateTask);
  const isDone = task.status === "done";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="group flex items-start gap-2 sm:gap-3 rounded-xl border border-border bg-surface-elevated p-3 transition-shadow hover:shadow-soft"
    >
      {dragHandle && (
        <div className="mt-1 cursor-grab active:cursor-grabbing text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity">
          {dragHandle}
        </div>
      )}
      <button
        type="button"
        onClick={() => toggleComplete(task.id)}
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          isDone
            ? "border-accent bg-accent text-white"
            : "border-border hover:border-accent-muted"
        }`}
        aria-label={isDone ? "Mark incomplete" : "Mark complete"}
      >
        {isDone && <Check className="h-3 w-3" />}
      </button>
      <div className="min-w-0 flex-1" onClick={() => setExpanded(!expanded)}>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`font-medium text-text-primary ${
              isDone ? "line-through text-text-tertiary" : ""
            }`}
          >
            {task.title}
          </span>
          <PriorityBadge priority={task.priority} />
          {task.dueTime && (
            <span className="flex items-center gap-1 text-xs text-text-tertiary">
              <Clock className="h-3 w-3" />
              {task.dueTime}
            </span>
          )}
        </div>
        {task.tags.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {task.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        )}
        <AnimatePresence>
          {expanded && task.description && (
            <motion.p
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-2 text-sm text-text-secondary"
            >
              {task.description}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      <div className="flex items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
        {onEdit && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
          >
            Edit
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-text-tertiary hover:text-red-500"
          icon={<Trash2 className="h-4 w-4" />}
          onClick={(e) => {
            e.stopPropagation();
            deleteTask(task.id);
          }}
          aria-label="Delete task"
        />
      </div>
    </motion.div>
  );
}
