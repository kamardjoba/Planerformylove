"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { Sparkles } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { HabitStreak } from "@/components/habits/HabitStreak";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { QuickAddTask } from "@/components/tasks/QuickAddTask";
import { TaskCard } from "@/components/tasks/TaskCard";
import Link from "next/link";

const MOTIVATIONAL = [
  "You've got this.",
  "Small steps lead to big wins.",
  "Focus on one thing at a time.",
  "Progress over perfection.",
  "Your best day starts with a plan.",
];

export default function DashboardPage() {
  const today = format(new Date(), "yyyy-MM-dd");
  const tasks = useStore((s) => s.getTasksForDate(today));
  const habits = useStore((s) => s.habits);
  const completed = tasks.filter((t) => t.status === "done").length;
  const total = tasks.length;
  const message = MOTIVATIONAL[new Date().getDate() % MOTIVATIONAL.length];

  return (
    <div className="mx-auto max-w-4xl px-4 py-5 sm:p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-xl font-semibold text-text-primary sm:text-2xl md:text-3xl">
          Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}
        </h1>
        <p className="mt-1 text-text-secondary">
          {format(new Date(), "EEEE, MMMM d")}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-8 flex items-center gap-3 rounded-2xl border border-border bg-accent-subtle/50 px-4 py-3"
      >
        <Sparkles className="h-5 w-5 shrink-0 text-accent" />
        <p className="text-sm font-medium text-text-primary">{message}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader
            title="Today's progress"
            subtitle={`${completed} of ${total} tasks completed`}
            action={
              total > 0 && (
                <div className="text-right text-sm font-medium text-accent">
                  {total ? Math.round((completed / total) * 100) : 0}%
                </div>
              )
            }
          />
          <CardContent>
            <ProgressBar value={completed} max={total || 1} />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-8"
      >
        <h2 className="mb-4 text-lg font-semibold text-text-primary">
          Today's tasks
        </h2>
        <div className="mb-4">
          <QuickAddTask date={today} placeholder="Quick add a task..." />
        </div>
        <div className="space-y-2">
          {tasks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-surface-muted/50 py-12 text-center text-text-secondary">
              <p>No tasks for today. Add one above or plan your day in the Planner.</p>
              <Link href="/app/planner" className="mt-2 inline-block text-accent hover:underline">
                Open Planner →
              </Link>
            </div>
          ) : (
            tasks.slice(0, 5).map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          )}
        </div>
        {tasks.length > 5 && (
          <Link
            href="/app/planner"
            className="mt-4 inline-block text-sm font-medium text-accent hover:underline"
          >
            View all {tasks.length} tasks →
          </Link>
        )}
      </motion.div>

      {habits.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <HabitStreak habits={habits} />
        </motion.div>
      )}
    </div>
  );
}
