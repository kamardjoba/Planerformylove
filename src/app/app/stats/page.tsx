"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { format, subDays, startOfWeek, endOfWeek } from "date-fns";
import { CheckCircle2, TrendingUp, Flame, Target } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { useStore } from "@/store/useStore";

export default function StatsPage() {
  const tasks = useStore((s) => s.tasks);
  const habits = useStore((s) => s.habits);

  const today = format(new Date(), "yyyy-MM-dd");
  const todayCompleted = tasks.filter(
    (t) => t.dueDate === today && t.status === "done"
  ).length;
  const todayTotal = tasks.filter((t) => t.dueDate === today).length;

  const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd");
  const weekEnd = format(endOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd");
  const weekTasks = tasks.filter(
    (t) => t.dueDate != null && t.dueDate >= weekStart && t.dueDate <= weekEnd
  );
  const weekCompleted = weekTasks.filter((t) => t.status === "done").length;
  const weekTotal = weekTasks.length;

  const last7Days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = subDays(new Date(), 6 - i);
      const dateStr = format(d, "yyyy-MM-dd");
      const dayTasks = tasks.filter((t) => t.dueDate === dateStr);
      return {
        date: format(d, "EEE"),
        fullDate: dateStr,
        completed: dayTasks.filter((t) => t.status === "done").length,
        total: dayTasks.length,
        pct:
          dayTasks.length > 0
            ? Math.round(
                (dayTasks.filter((t) => t.status === "done").length /
                  dayTasks.length) *
                  100
              )
            : 0,
      };
    });
  }, [tasks]);

  const maxTotal = Math.max(...last7Days.map((d) => d.total), 1);

  return (
    <div className="mx-auto max-w-4xl px-4 py-5 sm:p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-xl font-semibold text-text-primary sm:text-2xl">Statistics</h1>
        <p className="mt-1 text-text-secondary">
          Your productivity at a glance
        </p>
      </motion.div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Today",
            value: `${todayCompleted}/${todayTotal}`,
            sub: "tasks completed",
            icon: CheckCircle2,
            color: "text-emerald-500",
          },
          {
            label: "This week",
            value: `${weekCompleted}/${weekTotal}`,
            sub: "tasks completed",
            icon: TrendingUp,
            color: "text-accent",
          },
          {
            label: "Completion rate",
            value:
              weekTotal > 0
                ? `${Math.round((weekCompleted / weekTotal) * 100)}%`
                : "—",
            sub: "last 7 days",
            icon: Target,
            color: "text-amber-500",
          },
          {
            label: "Top streak",
            value: habits.length
              ? Math.max(...habits.map((h) => h.streak), 0).toString()
              : "0",
            sub: "days (habits)",
            icon: Flame,
            color: "text-rose-500",
          },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            className="rounded-2xl border border-border bg-surface-elevated p-6 shadow-soft"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-text-tertiary">
                  {card.label}
                </p>
                <p className="mt-1 text-2xl font-semibold text-text-primary">
                  {card.value}
                </p>
                <p className="mt-0.5 text-xs text-text-secondary">{card.sub}</p>
              </div>
              <card.icon className={`h-8 w-8 ${card.color}`} />
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-border bg-surface-elevated p-6"
      >
        <h2 className="mb-4 font-semibold text-text-primary">
          Completion last 7 days
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last7Days} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "var(--text-tertiary)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, maxTotal]}
                tick={{ fontSize: 12, fill: "var(--text-tertiary)" }}
                axisLine={false}
                tickLine={false}
                width={24}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--surface-elevated)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                }}
                labelStyle={{ color: "var(--text-primary)" }}
                formatter={(value, _name, item) => {
                  const p = (item as { payload?: { completed: number; total: number } }).payload;
                  return [p ? `${p.completed}/${p.total} tasks` : value, "Completed"];
                }}
              />
              <Bar
                dataKey="completed"
                fill="var(--accent)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mt-8 rounded-2xl border border-border bg-surface-elevated p-6"
      >
        <h2 className="mb-4 font-semibold text-text-primary">
          Daily completion %
        </h2>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={last7Days} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="pctGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "var(--text-tertiary)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 12, fill: "var(--text-tertiary)" }}
                axisLine={false}
                tickLine={false}
                width={32}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--surface-elevated)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                }}
                formatter={(value: number) => [`${value}%`, "Completion"]}
              />
              <Area
                type="monotone"
                dataKey="pct"
                stroke="var(--accent)"
                strokeWidth={2}
                fill="url(#pctGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
