"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useDragControls } from "framer-motion";
import { GripVertical, Trash2, MoreHorizontal } from "lucide-react";
import type { TimeBlock } from "@/types";
import { useTimeBlockStore, COLOR_HEX, minutesToLabel } from "@/store/timeBlockStore";
import { HOUR_START, HOUR_END } from "@/store/timeBlockStore";

const TOTAL_MINUTES = (24 - HOUR_START) * 60;
const START_BASE = HOUR_START * 60;
const MIN_DURATION = 30;

interface BlockCardProps {
  block: TimeBlock;
  timelineRef: React.RefObject<HTMLDivElement | null>;
  onEdit?: (block: TimeBlock) => void;
  onDragEnd?: (block: TimeBlock, newStartMinutes: number) => void;
}

export function BlockCard({ block, timelineRef, onEdit, onDragEnd }: BlockCardProps) {
  const [resizing, setResizing] = useState(false);
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [optimisticStart, setOptimisticStart] = useState<number | null>(null);
  const dragControls = useDragControls();
  const startY = useRef(0);
  const startEnd = useRef(0);
  const resizeBlock = useTimeBlockStore((s) => s.resizeBlock);
  const deleteBlock = useTimeBlockStore((s) => s.deleteBlock);
  const bgColor = COLOR_HEX[block.color] ?? COLOR_HEX.indigo;

  const topPct = ((block.startMinutes - START_BASE) / TOTAL_MINUTES) * 100;
  const heightPct =
    ((block.endMinutes - block.startMinutes) / TOTAL_MINUTES) * 100;
  const duration = block.endMinutes - block.startMinutes;

  const getPreviewStart = (offsetY: number) => {
    if (!timelineRef.current) return block.startMinutes;
    const height = timelineRef.current.scrollHeight;
    const originalTopPx = (topPct / 100) * height;
    const newTopPx = originalTopPx + offsetY;
    const ratio = Math.max(0, Math.min(1, newTopPx / height));
    const newStart = Math.round((START_BASE + ratio * TOTAL_MINUTES) / 15) * 15;
    return Math.max(START_BASE, Math.min(23 * 60 - MIN_DURATION, newStart));
  };

  const previewStart = isDragging
    ? getPreviewStart(dragOffsetY)
    : (optimisticStart ?? block.startMinutes);
  const previewEnd = Math.min(24 * 60, previewStart + duration);

  useEffect(() => {
    if (optimisticStart !== null && block.startMinutes === optimisticStart) {
      setOptimisticStart(null);
    }
  }, [block.startMinutes, optimisticStart]);

  const handleResizeStart = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setResizing(true);
    startY.current = e.clientY;
    startEnd.current = block.endMinutes;
  };

  const handleResizeMove = (e: PointerEvent) => {
    if (!resizing) return;
    const deltaY = e.clientY - startY.current;
    const pixelsPerMinute = (document.getElementById("day-timeline-height")?.clientHeight ?? 400) / TOTAL_MINUTES;
    const deltaMinutes = Math.round(deltaY / pixelsPerMinute);
    const newEnd = Math.max(
      block.startMinutes + MIN_DURATION,
      Math.min(24 * 60, startEnd.current + deltaMinutes)
    );
    resizeBlock(block.id, newEnd);
  };

  const handleResizeEnd = () => {
    setResizing(false);
    startY.current = 0;
    startEnd.current = 0;
    window.removeEventListener("pointermove", handleResizeMove);
    window.removeEventListener("pointerup", handleResizeEnd);
  };

  const onPointerDownResize = (e: React.PointerEvent) => {
    e.preventDefault();
    startY.current = e.clientY;
    startEnd.current = block.endMinutes;
    setResizing(true);
    window.addEventListener("pointermove", handleResizeMove);
    window.addEventListener("pointerup", handleResizeEnd);
  };

  return (
    <motion.div
      data-block-id={block.id}
      layout
      drag={onDragEnd ? "y" : false}
      dragListener={false}
      dragControls={dragControls}
      dragConstraints={timelineRef}
      dragElastic={0}
      dragMomentum={false}
      onDragStart={() => {
        setIsDragging(true);
        setDragOffsetY(0);
      }}
      onDrag={(_, info) => {
        setDragOffsetY(info.offset.y);
      }}
      onDragEnd={(_, info) => {
        if (!onDragEnd || !timelineRef.current) return;
        const el = timelineRef.current;
        const height = el.scrollHeight;
        const originalTopPx = (topPct / 100) * height;
        const newTopPx = originalTopPx + info.offset.y;
        const ratio = Math.max(0, Math.min(1, newTopPx / height));
        const newStart = Math.round((START_BASE + ratio * TOTAL_MINUTES) / 15) * 15;
        const clamped = Math.max(START_BASE, Math.min(23 * 60 - MIN_DURATION, newStart));
        setOptimisticStart(clamped);
        setIsDragging(false);
        setDragOffsetY(0);
        onDragEnd(block, clamped);
      }}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="absolute left-1 right-1 flex flex-col rounded-xl shadow-md"
      style={{
        top: `${topPct}%`,
        height: `${heightPct}%`,
        minHeight: 44,
      }}
    >
      <div
        className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl text-white"
        style={{ backgroundColor: bgColor }}
      >
        <div className="flex items-start gap-1 p-2">
          <div
            className="cursor-grab active:cursor-grabbing touch-none"
            onPointerDown={(e) => {
              e.stopPropagation();
              dragControls.start(e);
            }}
          >
            <GripVertical className="h-4 w-4 opacity-80" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{block.title || "Block"}</p>
            <p className="text-xs opacity-85">
              {minutesToLabel(previewStart)} – {minutesToLabel(previewEnd)}
            </p>
          </div>
          <div className="flex gap-0.5">
            <button
              type="button"
              onClick={() => onEdit?.(block)}
              className="rounded p-1 hover:bg-white/20"
              aria-label="Edit"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => deleteBlock(block.id)}
              className="rounded p-1 hover:bg-white/20"
              aria-label="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div
          onPointerDown={onPointerDownResize}
          className="h-2 shrink-0 cursor-ns-resize touch-none border-t border-white/20 active:bg-white/20"
          aria-label="Resize"
        />
      </div>
    </motion.div>
  );
}
