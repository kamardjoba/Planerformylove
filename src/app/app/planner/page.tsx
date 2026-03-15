"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { useStore } from "@/store/useStore";
import { QuickAddTask } from "@/components/tasks/QuickAddTask";
import { SortableTaskList } from "@/components/tasks/SortableTaskList";
import { TaskModal } from "@/components/tasks/TaskModal";
import type { Task } from "@/types";

export default function PlannerPage() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showNewTask, setShowNewTask] = useState(false);
  const tasks = useStore((s) => s.getTasksForDate(selectedDate));

  return (
    <div className="mx-auto max-w-3xl px-4 py-5 sm:p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-xl font-semibold text-text-primary sm:text-2xl">Planner</h1>
          <p className="mt-1 text-text-secondary">
            Drag to reorder. Click a task to edit.
          </p>
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="rounded-xl border border-border bg-surface-elevated px-4 py-2.5 text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-6"
      >
        <QuickAddTask
          date={selectedDate}
          placeholder="Add a task..."
          onAdded={() => setShowNewTask(false)}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-text-secondary">
            {format(new Date(selectedDate), "EEEE, MMM d")}
          </span>
          <button
            type="button"
            onClick={() => setShowNewTask(true)}
            className="flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
          >
            <Plus className="h-4 w-4" />
            New task
          </button>
        </div>
        {tasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface-muted/50 py-16 text-center text-text-secondary">
            <p>No tasks for this day.</p>
            <p className="mt-1 text-sm">Use the field above or &quot;New task&quot; to add one.</p>
          </div>
        ) : (
          <SortableTaskList
            tasks={tasks}
            date={selectedDate}
            onEditTask={setEditingTask}
          />
        )}
      </motion.div>

      {(editingTask || showNewTask) && (
        <TaskModal
          task={editingTask ?? null}
          date={selectedDate}
          onClose={() => {
            setEditingTask(null);
            setShowNewTask(false);
          }}
        />
      )}
    </div>
  );
}
