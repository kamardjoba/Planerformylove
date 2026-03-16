"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { TimeBlock, TimeBlockColor } from "@/types";
import type { Priority } from "@/types";
import { useTimeBlockStore, COLOR_OPTIONS, HOUR_START, HOUR_END } from "@/store/timeBlockStore";
import { DAY_LABELS } from "@/store/timeBlockStore";

const HOURS = Array.from(
  { length: HOUR_END - HOUR_START },
  (_, i) => HOUR_START + i
);

interface BlockModalProps {
  block: TimeBlock | null;
  dayIndex: number;
  onClose: () => void;
}

export function BlockModal({ block, dayIndex, onClose }: BlockModalProps) {
  const addBlock = useTimeBlockStore((s) => s.addBlock);
  const updateBlock = useTimeBlockStore((s) => s.updateBlock);
  const isEdit = !!block;

  const [title, setTitle] = useState("");
  const [color, setColor] = useState<TimeBlockColor>("indigo");
  const [priority, setPriority] = useState<Priority>("medium");
  const [startHour, setStartHour] = useState(9);
  const [endHour, setEndHour] = useState(10);
  const [selectedDay, setSelectedDay] = useState(dayIndex);

  useEffect(() => {
    if (block) {
      setTitle(block.title);
      setColor(block.color);
      setPriority(block.priority);
      setStartHour(Math.floor(block.startMinutes / 60));
      setEndHour(Math.floor(block.endMinutes / 60));
    } else {
      setTitle("");
      setColor("indigo");
      setPriority("medium");
      setStartHour(9);
      setEndHour(10);
      setSelectedDay(dayIndex);
    }
  }, [block, dayIndex]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const startMinutes = Math.max(HOUR_START * 60, startHour * 60);
    const endMinutes = Math.min(
      HOUR_END * 60,
      Math.max(startMinutes + 30, endHour * 60)
    );
    if (isEdit && block) {
      updateBlock(block.id, {
        title: title.trim() || "Block",
        color,
        priority,
        startMinutes,
        endMinutes,
      });
    } else {
      addBlock({
        dayIndex: selectedDay,
        title: title.trim() || "Block",
        color,
        priority,
        startMinutes,
        endMinutes,
      });
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25 }}
          className="w-full max-w-md rounded-t-2xl border border-border bg-surface-elevated p-5 shadow-glass sm:rounded-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">
              {isEdit ? "Edit block" : "New block"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-text-tertiary hover:bg-surface-muted"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Meeting, focus time..."
                className="w-full rounded-xl border border-border bg-surface-muted px-4 py-2.5 text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none"
                autoFocus
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                Day
              </label>
              <select
                value={isEdit ? dayIndex : selectedDay}
                onChange={(e) => setSelectedDay(parseInt(e.target.value, 10))}
                className="w-full rounded-xl border border-border bg-surface-muted px-4 py-2.5 text-text-primary focus:border-accent focus:outline-none"
                disabled={isEdit}
              >
                {DAY_LABELS.map((label, i) => (
                  <option key={label} value={i}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                  Start
                </label>
                <select
                  value={startHour}
                  onChange={(e) => setStartHour(parseInt(e.target.value, 10))}
                  className="w-full rounded-xl border border-border bg-surface-muted px-4 py-2.5 text-text-primary focus:border-accent focus:outline-none"
                >
                  {HOURS.map((h) => (
                    <option key={h} value={h}>
                      {h.toString().padStart(2, "0")}:00
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                  End
                </label>
                <select
                  value={endHour}
                  onChange={(e) => setEndHour(parseInt(e.target.value, 10))}
                  className="w-full rounded-xl border border-border bg-surface-muted px-4 py-2.5 text-text-primary focus:border-accent focus:outline-none"
                >
                  {HOURS.map((h) => (
                    <option key={h} value={h}>
                      {h.toString().padStart(2, "0")}:00
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                Color
              </label>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setColor(opt.value)}
                    className={`h-8 w-8 rounded-lg border-2 transition-colors ${
                      color === opt.value
                        ? "border-accent ring-2 ring-accent/30"
                        : "border-border hover:border-accent/50"
                    } ${opt.value === "indigo" ? "bg-indigo-500" : ""} ${opt.value === "emerald" ? "bg-emerald-500" : ""} ${opt.value === "amber" ? "bg-amber-500" : ""} ${opt.value === "rose" ? "bg-rose-500" : ""} ${opt.value === "sky" ? "bg-sky-500" : ""} ${opt.value === "violet" ? "bg-violet-500" : ""}`}
                    aria-label={opt.label}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                Priority
              </label>
              <div className="flex gap-2">
                {(["low", "medium", "high"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 rounded-lg py-2 text-sm font-medium capitalize ${
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
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-text-secondary hover:bg-surface-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-xl bg-accent py-2.5 text-sm font-medium text-white hover:opacity-90"
              >
                {isEdit ? "Save" : "Add"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
