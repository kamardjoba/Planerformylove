"use client";

import { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import { useStore } from "@/store/useStore";
import { format } from "date-fns";
import { Input } from "@/components/ui/Input";

interface QuickAddTaskProps {
  date: string;
  onAdded?: () => void;
  placeholder?: string;
}

export function QuickAddTask({
  date,
  onAdded,
  placeholder = "Add a task...",
}: QuickAddTaskProps) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const addTask = useStore((s) => s.addTask);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const title = value.trim();
    if (!title) return;
    addTask({
      title,
      priority: "medium",
      tags: [],
      status: "todo",
      dueDate: date,
    });
    setValue("");
    onAdded?.();
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className="flex-1"
      />
      <button
        type="submit"
        disabled={!value.trim()}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        aria-label="Add task"
      >
        <Plus className="h-4 w-4" />
      </button>
    </form>
  );
}
