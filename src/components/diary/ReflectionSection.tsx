"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useDiaryStore } from "@/store/diaryStore";

const AUTOSAVE_MS = 600;

const QUESTIONS = [
  {
    key: "whatWentWell" as const,
    label: "What went well?",
    placeholder: "Things that worked out...",
  },
  {
    key: "whatToImprove" as const,
    label: "What could be improved?",
    placeholder: "Areas to focus on...",
  },
  {
    key: "achievement" as const,
    label: "Biggest achievement this week?",
    placeholder: "Your win...",
  },
];

export function ReflectionSection() {
  const weeklyReflection = useDiaryStore((s) => s.weeklyReflection);
  const updateWeeklyReflection = useDiaryStore((s) => s.updateWeeklyReflection);
  const [local, setLocal] = useState(weeklyReflection);

  useEffect(() => {
    setLocal(weeklyReflection);
  }, [weeklyReflection.whatWentWell, weeklyReflection.whatToImprove, weeklyReflection.achievement]);

  const flush = useCallback(() => {
    updateWeeklyReflection(local);
  }, [local, updateWeeklyReflection]);

  useEffect(() => {
    const t = setTimeout(flush, AUTOSAVE_MS);
    return () => clearTimeout(t);
  }, [local, flush]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="rounded-2xl border border-border bg-surface-elevated p-4 shadow-soft sm:p-5"
    >
      <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold text-text-primary">
        <Sparkles className="h-5 w-5 text-accent" />
        Weekly Reflection
      </h2>
      <p className="mb-4 text-sm text-text-secondary">
        Look back at your week and set intentions.
      </p>
      <div className="space-y-4">
        {QUESTIONS.map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="mb-1.5 block text-sm font-medium text-text-primary">
              {label}
            </label>
            <textarea
              value={local[key]}
              onChange={(e) =>
                setLocal((prev) => ({ ...prev, [key]: e.target.value }))
              }
              onBlur={flush}
              placeholder={placeholder}
              rows={2}
              className="w-full resize-none rounded-xl border border-border bg-surface-muted/50 px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>
        ))}
      </div>
    </motion.section>
  );
}
