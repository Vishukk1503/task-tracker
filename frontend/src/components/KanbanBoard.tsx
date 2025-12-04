/**
 * Kanban Board with drag-and-drop functionality
 */
'use client';

import { useState, useMemo } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { Task, TaskStatus } from '@/lib/api';
import { KanbanColumn } from './KanbanColumn';
import { DraggableTaskCard } from './DraggableTaskCard';
import confetti from 'canvas-confetti';

interface KanbanBoardProps {
  tasks: Task[];
  onUpdateTask: (id: number, data: any) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: number) => void;
  isLoading?: boolean;
}

const COLUMNS = [
  {
    id: TaskStatus.NOT_STARTED,
    title: '📋 Not Started',
    gradient: 'from-gray-400 to-gray-500',
    bgGradient: 'from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50',
  },
  {
    id: TaskStatus.IN_PROGRESS,
    title: '🚀 In Progress',
    gradient: 'from-blue-400 to-blue-600',
    bgGradient: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20',
  },
  {
    id: TaskStatus.COMPLETED,
    title: '✅ Completed',
    gradient: 'from-green-400 to-green-600',
    bgGradient: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20',
  },
];

export function KanbanBoard({ tasks, onUpdateTask, onEditTask, onDeleteTask, isLoading }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Group tasks by status
  const tasksByStatus = useMemo(() => {
    return {
      [TaskStatus.NOT_STARTED]: tasks.filter(t => t.status === TaskStatus.NOT_STARTED),
      [TaskStatus.IN_PROGRESS]: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS),
      [TaskStatus.COMPLETED]: tasks.filter(t => t.status === TaskStatus.COMPLETED),
    };
  }, [tasks]);

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as number;
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) return;

    // Check if dropped on a column (status) or another task
    let newStatus: TaskStatus;
    
    // If dropped on a column directly
    if (over.id === TaskStatus.NOT_STARTED || over.id === TaskStatus.IN_PROGRESS || over.id === TaskStatus.COMPLETED) {
      newStatus = over.id as TaskStatus;
    } else {
      // If dropped on another task, find which column it's in
      const targetTask = tasks.find(t => t.id === over.id);
      if (!targetTask) return;
      newStatus = targetTask.status;
    }

    // Only update if status actually changed
    if (task.status !== newStatus) {
      // Trigger confetti if task moved to completed
      if (newStatus === TaskStatus.COMPLETED) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#34d399', '#6ee7b7'],
        });
      }

      // Update task status
      onUpdateTask(taskId, { status: newStatus });
    }
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 auto-rows-fr animate-in fade-in slide-in-from-bottom-4 duration-500">
        {COLUMNS.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            gradient={column.gradient}
            bgGradient={column.bgGradient}
            tasks={tasksByStatus[column.id]}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            isLoading={isLoading}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="rotate-3 opacity-80">
            <DraggableTaskCard
              task={activeTask}
              onEdit={() => {}}
              onDelete={() => {}}
              isDragging
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
