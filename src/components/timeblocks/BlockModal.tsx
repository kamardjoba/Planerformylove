"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { TimeBlock, TimeBlockColor } from "@/types";
import type { Priority } from "@/types";
import { useTimeBlockStore, COLOR_OPTIONS, HOUR_START, HOUR_END, minutesToLabel } from "@/store/timeBlockStore";
import { DAY_LABELS } from "@/store/timeBlockStore";

function minutesToTime(minutes: number): { hour: number; minute: number } {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return { hour: h, minute: m };
}
function timeToMinutes(hour: number, minute: number): number {
  return hour * 60 + minute;
}

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
  const [startMinute, setStartMinute] = useState(0);
  const [endHour, setEndHour] = useState(10);
  const [endMinute, setEndMinute] = useState(0);
  const [selectedDay, setSelectedDay] = useState(dayIndex);

  useEffect(() => {
    if (block) {
      setTitle(block.title);
      setColor(block.color);
      setPriority(block.priority);
      const start = minutesToTime(block.startMinutes);
      const end = minutesToTime(block.endMinutes);
      setStartHour(start.hour);
      setStartMinute(start.minute);
      setEndHour(end.hour);
      setEndMinute(end.minute);
    } else {
      setTitle("");
      setColor("indigo");
      setPriority("medium");
      setStartHour(9);
      setStartMinute(0);
      setEndHour(10);
      setEndMinute(0);
      setSelectedDay(dayIndex);
    }
  }, [block, dayIndex]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const startMinutes = Math.max(
      HOUR_START * 60,
      timeToMinutes(startHour, startMinute)
    );
    let endMinutes = timeToMinutes(endHour, endMinute);
    if (endMinutes <= startMinutes) endMinutes = startMinutes + 30;
    endMinutes = Math.min(HOUR_END * 60, Math.max(startMinutes + 30, endMinutes));
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
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={HOUR_START}
                    max={23}
                    value={startHour}
                    onChange={(e) => setStartHour(parseInt(e.target.value, 10) || 0)}
                    className="w-16 rounded-xl border border-border bg-surface-muted px-3 py-2.5 text-center text-text-primary focus:border-accent focus:outline-none"
                  />
                  <span className="flex items-center text-text-tertiary">:</span>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={startMinute}
                    onChange={(e) => setStartMinute(Math.min(59, Math.max(0, parseInt(e.target.value, 10) || 0)))}
                    className="w-16 rounded-xl border border-border bg-surface-muted px-3 py-2.5 text-center text-text-primary focus:border-accent focus:outline-none"
                  />
                </div>
                <p className="mt-0.5 text-xs text-text-tertiary">
                  {minutesToLabel(timeToMinutes(startHour, startMinute))}
                </p>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                  End (до 24:00)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={HOUR_START}
                    max={24}
                    value={endHour}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10) || 0;
                      setEndHour(v);
                      if (v === 24) setEndMinute(0);
                    }}
                    className="w-16 rounded-xl border border-border bg-surface-muted px-3 py-2.5 text-center text-text-primary focus:border-accent focus:outline-none"
                  />
                  <span className="flex items-center text-text-tertiary">:</span>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={endMinute}
                    onChange={(e) => setEndMinute(Math.min(59, Math.max(0, parseInt(e.target.value, 10) || 0)))}
                    className="w-16 rounded-xl border border-border bg-surface-muted px-3 py-2.5 text-center text-text-primary focus:border-accent focus:outline-none"
                    disabled={endHour === 24}
                  />
                </div>
                <p className="mt-0.5 text-xs text-text-tertiary">
                  {endHour === 24 ? "24:00" : minutesToLabel(timeToMinutes(endHour, endMinute))}
                </p>
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
