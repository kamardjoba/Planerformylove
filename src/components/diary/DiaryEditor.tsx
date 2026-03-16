"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Plus, Trash2 } from "lucide-react";
import type { DiaryCheckItem } from "@/types";

const AUTOSAVE_MS = 800;

interface DiaryEditorProps {
  notes: string;
  onNotesChange: (value: string) => void;
  tasks: DiaryCheckItem[];
  onAddTask: (text: string) => void;
  onToggleTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, text: string) => void;
  onDeleteTask: (taskId: string) => void;
  reflection: string;
  onReflectionChange: (value: string) => void;
  placeholder?: string;
}

export function DiaryEditor({
  notes,
  onNotesChange,
  tasks,
  onAddTask,
  onToggleTask,
  onUpdateTask,
  onDeleteTask,
  reflection,
  onReflectionChange,
  placeholder = "Notes, ideas...",
}: DiaryEditorProps) {
  const [localNotes, setLocalNotes] = useState(notes);
  const [localReflection, setLocalReflection] = useState(reflection);
  const [newTaskText, setNewTaskText] = useState("");
  const [expanded, setExpanded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalNotes(notes);
    setLocalReflection(reflection);
  }, [notes, reflection]);

  const flushNotes = useCallback(() => {
    if (localNotes !== notes) onNotesChange(localNotes);
  }, [localNotes, notes, onNotesChange]);

  const flushReflection = useCallback(() => {
    if (localReflection !== reflection) onReflectionChange(localReflection);
  }, [localReflection, reflection, onReflectionChange]);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      flushNotes();
      flushReflection();
    }, AUTOSAVE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [localNotes, localReflection, flushNotes, flushReflection]);

  const handleAddTask = () => {
    const t = newTaskText.trim();
    if (t) {
      onAddTask(t);
      setNewTaskText("");
    } else {
      onAddTask("New item");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <textarea
          value={localNotes}
          onChange={(e) => setLocalNotes(e.target.value)}
          onBlur={flushNotes}
          placeholder={placeholder}
          rows={expanded ? 6 : 3}
          className="w-full resize-none rounded-xl border border-border bg-surface-muted/50 px-4 py-3 text-[15px] leading-relaxed text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-1 text-xs font-medium text-accent hover:underline"
        >
          {expanded ? "Collapse" : "Expand"}
        </button>
      </div>

      <div className="rounded-xl border border-border bg-surface-muted/30 p-3">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-tertiary">
          Checklist
        </p>
        <div className="space-y-1.5">
          <AnimatePresence mode="popLayout">
            {tasks.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="group flex items-center gap-2 rounded-lg py-1"
              >
                <button
                  type="button"
                  onClick={() => onToggleTask(item.id)}
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                    item.done
                      ? "border-accent bg-accent text-white"
                      : "border-border hover:border-accent-muted"
                  }`}
                  aria-label={item.done ? "Mark incomplete" : "Mark done"}
                >
                  {item.done && <Check className="h-3.5 w-3.5" />}
                </button>
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => onUpdateTask(item.id, e.target.value)}
                  className={`min-w-0 flex-1 bg-transparent text-sm text-text-primary outline-none ${
                    item.done ? "line-through text-text-tertiary" : ""
                  }`}
                />
                <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                  <button
                    type="button"
                    onClick={() => onDeleteTask(item.id)}
                    className="rounded p-1.5 text-text-tertiary hover:bg-danger/10 hover:text-danger"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTask())}
              placeholder="Add task..."
              className="flex-1 rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddTask}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-white hover:opacity-90"
              aria-label="Add task"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-text-tertiary">
          Reflection
        </label>
        <textarea
          value={localReflection}
          onChange={(e) => setLocalReflection(e.target.value)}
          onBlur={flushReflection}
          placeholder="How did the day go?"
          rows={2}
          className="w-full resize-none rounded-xl border border-border bg-surface-muted/50 px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
      </div>
    </div>
  );
}
