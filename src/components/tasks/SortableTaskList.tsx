"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useStore } from "@/store/useStore";
import type { Task } from "@/types";
import { TaskCard } from "./TaskCard";
import { GripVertical } from "lucide-react";

interface SortableTaskListProps {
  tasks: Task[];
  date: string;
  onEditTask?: (task: Task) => void;
}

function SortableTaskItem({
  task,
  onEdit,
}: {
  task: Task;
  onEdit?: (task: Task) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className={isDragging ? "opacity-80" : ""}>
      <TaskCard
        task={task}
        onEdit={onEdit}
        dragHandle={
          <div {...attributes} {...listeners}>
            <GripVertical className="h-4 w-4" />
          </div>
        }
      />
    </div>
  );
}

export function SortableTaskList({
  tasks,
  date,
  onEditTask,
}: SortableTaskListProps) {
  const reorderTasks = useStore((s) => s.reorderTasks);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = tasks.findIndex((t) => t.id === active.id);
    const newIndex = tasks.findIndex((t) => t.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      reorderTasks(date, oldIndex, newIndex);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {tasks.map((task) => (
            <SortableTaskItem key={task.id} task={task} onEdit={onEditTask} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
