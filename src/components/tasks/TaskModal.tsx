"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { Task, Priority } from "@/types";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface TaskModalProps {
  task: Task | null;
  date: string;
  onClose: () => void;
}

const priorities: Priority[] = ["low", "medium", "high"];

export function TaskModal({ task, date, onClose }: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueTime, setDueTime] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const addTask = useStore((s) => s.addTask);
  const updateTask = useStore((s) => s.updateTask);
  const isEdit = !!task;

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setPriority(task.priority);
      setDueTime(task.dueTime || "");
      setTags(task.tags || []);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (isEdit && task) {
      updateTask(task.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        dueTime: dueTime || undefined,
        tags,
      });
    } else {
      addTask({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        dueDate: date,
        dueTime: dueTime || undefined,
        tags,
        status: "todo",
      });
    }
    onClose();
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
      setTagInput("");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ type: "spring", damping: 25 }}
          className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-surface-elevated p-4 shadow-glass sm:p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-text-primary">
              {isEdit ? "Edit task" : "New task"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-text-tertiary hover:bg-surface-muted hover:text-text-primary"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              required
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add details..."
                rows={3}
                className="w-full rounded-xl border border-border bg-surface-elevated px-4 py-2.5 text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                Priority
              </label>
              <div className="flex gap-2">
                {priorities.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                      priority === p
                        ? "bg-accent text-white"
                        : "bg-surface-muted text-text-secondary hover:bg-border"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <Input
              label="Due time"
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 rounded-lg bg-surface-muted px-2 py-0.5 text-xs"
                  >
                    {t}
                    <button
                      type="button"
                      onClick={() => setTags(tags.filter((x) => x !== t))}
                      className="hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  placeholder="Add tag..."
                  className="w-24 rounded-lg border-0 bg-transparent px-2 py-0.5 text-sm outline-none placeholder:text-text-tertiary"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">{isEdit ? "Save" : "Add task"}</Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
