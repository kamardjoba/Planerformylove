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
const ROW_HEIGHT = 48;

interface BlockCardProps {
  block: TimeBlock;
  timelineRef: React.RefObject<HTMLDivElement | null>;
  onEdit?: (block: TimeBlock) => void;
  onDragEnd?: (block: TimeBlock, newStartMinutes: number) => void;
}

export function BlockCard({ block, timelineRef, onEdit, onDragEnd }: BlockCardProps) {
  const [resizing, setResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [optimisticStart, setOptimisticStart] = useState<number | null>(null);
  const [dragPreviewStart, setDragPreviewStart] = useState<number | null>(null);
  const dragStartTopPx = useRef(0);
  const dragContentHeightPx = useRef(1);
  const dragControls = useDragControls();
  const startY = useRef(0);
  const startEnd = useRef(0);
  const prevTimelineOverflowYRef = useRef<string | null>(null);
  const didDisableTelegramSwipesRef = useRef(false);
  const resizeBlock = useTimeBlockStore((s) => s.resizeBlock);
  const deleteBlock = useTimeBlockStore((s) => s.deleteBlock);
  const bgColor = COLOR_HEX[block.color] ?? COLOR_HEX.indigo;

  const duration = Math.max(MIN_DURATION, block.endMinutes - block.startMinutes);

  const previewStart = isDragging
    ? (dragPreviewStart ?? block.startMinutes)
    : optimisticStart ?? block.startMinutes;
  const previewEnd = Math.min(24 * 60, previewStart + duration);

  const dragConstraintsRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    dragConstraintsRef.current = document.getElementById("day-block-area") as HTMLDivElement | null;
  }, []);

  // Позиционируем внутри "временного" участка (18 часов из 19 строк),
  // чтобы 19:00-20:00 и 23:00-24:00 совпадали с линиями.
  const topPct =
    ((previewStart - START_BASE) / TOTAL_MINUTES) * 100;
  const heightPct =
    ((previewEnd - previewStart) / TOTAL_MINUTES) * 100;

  useEffect(() => {
    if (optimisticStart !== null && block.startMinutes === optimisticStart) {
      setOptimisticStart(null);
    }
  }, [block.startMinutes, optimisticStart]);

  // Во время drag блокируем прокрутку страницы/контейнера,
  // чтобы перетаскивание не превращалось в scroll и не вызывало "сворачивание" UI.
  useEffect(() => {
    const disableScroll = () => {
      const timeline = document.getElementById(
        "day-timeline-height"
      ) as HTMLDivElement | null;
      if (timeline && prevTimelineOverflowYRef.current === null) {
        prevTimelineOverflowYRef.current = timeline.style.overflowY;
        timeline.style.overflowY = "hidden";
        timeline.style.touchAction = "none";
      }

      // В Telegram Mini Apps вертикальные свайпы могут "сворачивать" приложение.
      // Запрещаем это во время перетаскивания.
      const tg = (window as any)?.Telegram?.WebApp;
      if (tg?.disableVerticalSwipes && !didDisableTelegramSwipesRef.current) {
        tg.disableVerticalSwipes();
        didDisableTelegramSwipesRef.current = true;
      }
    };

    const restoreScroll = () => {
      const timeline = document.getElementById(
        "day-timeline-height"
      ) as HTMLDivElement | null;
      if (timeline && prevTimelineOverflowYRef.current !== null) {
        timeline.style.overflowY = prevTimelineOverflowYRef.current;
        timeline.style.touchAction = "";
        prevTimelineOverflowYRef.current = null;
      }

      const tg = (window as any)?.Telegram?.WebApp;
      if (
        didDisableTelegramSwipesRef.current &&
        tg?.enableVerticalSwipes
      ) {
        tg.enableVerticalSwipes();
      }
      didDisableTelegramSwipesRef.current = false;
    };

    if (isDragging) disableScroll();
    else restoreScroll();

    return () => {
      // На случай unmount во время drag.
      restoreScroll();
    };
  }, [isDragging]);

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
    const pixelsPerMinute =
      (document.getElementById("day-block-area")?.clientHeight ?? 400) /
      TOTAL_MINUTES;
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
      dragConstraints={dragConstraintsRef ?? timelineRef}
      dragElastic={0}
      dragMomentum={false}
      onDragStart={() => {
        const contentEl = document.getElementById("day-block-area");
        const totalH = contentEl?.clientHeight ?? 1;
        // Для DayView мы рисуем только 18 интервалов (без 24:00 строки),
        // поэтому высота mapping = полной высоте day-block-area.
        dragContentHeightPx.current = Math.max(1, totalH);
        dragStartTopPx.current =
          ((block.startMinutes - START_BASE) / TOTAL_MINUTES) * totalH;
        setDragPreviewStart(block.startMinutes);
      }}
      onDrag={(_, info) => {
        const contentHeight = dragContentHeightPx.current || 1;
        const newTopPx = dragStartTopPx.current + info.offset.y;
        const ratio = Math.max(0, Math.min(1, newTopPx / contentHeight));
        const newStart = Math.round(
          (START_BASE + ratio * TOTAL_MINUTES) / 15
        ) * 15;
        const startMax = 24 * 60 - duration;
        const clamped = Math.max(START_BASE, Math.min(startMax, newStart));
        setDragPreviewStart(clamped);
      }}
      onDragEnd={(_, info) => {
        if (!onDragEnd) return;
        const contentHeight = dragContentHeightPx.current || 1;
        const newTopPx = dragStartTopPx.current + info.offset.y;
        const ratio = Math.max(0, Math.min(1, newTopPx / contentHeight));
        const newStart = Math.round(
          (START_BASE + ratio * TOTAL_MINUTES) / 15
        ) * 15;
        const startMax = 24 * 60 - duration;
        const clamped = Math.max(START_BASE, Math.min(startMax, newStart));
        setOptimisticStart(clamped);
        setIsDragging(false);
        setDragPreviewStart(null);
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
            className="flex h-9 w-9 items-center justify-center cursor-grab active:cursor-grabbing touch-none select-none"
            style={{ touchAction: "none" }}
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();

              // Telegram Mini Apps может "свернуть" интерфейс при вертикальных жестах.
              // Поэтому отключаем vertical swipes сразу на момент касания/начала drag.
              const tg = (window as any)?.Telegram?.WebApp;
              if (tg?.disableVerticalSwipes && !didDisableTelegramSwipesRef.current) {
                tg.disableVerticalSwipes();
                didDisableTelegramSwipesRef.current = true;
              }

              // Отключаем скролл именно в области таймлайна (без body),
              // чтобы drag вниз не превращался в scroll.
              const timeline = document.getElementById(
                "day-timeline-height"
              ) as HTMLDivElement | null;
              if (timeline && prevTimelineOverflowYRef.current === null) {
                prevTimelineOverflowYRef.current = timeline.style.overflowY;
                timeline.style.overflowY = "hidden";
                timeline.style.touchAction = "none";
              }

              // Сбрасываем состояние превью перед каждым новым drag.
              setOptimisticStart(null);
              setIsDragging(true);
              setDragPreviewStart(block.startMinutes);
              dragControls.start(e);
            }}
          >


            <GripVertical className="h-5 w-5 opacity-80" />
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
              onClick={(e) => {
                // Не даем клику по кнопке разогнать/сработать как часть drag/interactions.
                e.stopPropagation();
                const title = (block.title ?? "").trim();
                const ok = window.confirm(
                  title
                    ? `Ты точно хочешь удалить задание "${title}"?`
                    : "Ты точно хочешь удалить это задание?"
                );
                if (ok) deleteBlock(block.id);
              }}
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
          style={{ touchAction: "none" }}
        />
      </div>
    </motion.div>
  );
}
