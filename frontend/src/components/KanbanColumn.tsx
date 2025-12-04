/**
 * Kanban Column - Droppable zone for tasks
 */
'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task, TaskStatus } from '@/lib/api';
import { DraggableTaskCard } from './DraggableTaskCard';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  gradient: string;
  bgGradient: string;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: number) => void;
  isLoading?: boolean;
}

export function KanbanColumn({
  id,
  title,
  gradient,
  bgGradient,
  tasks,
  onEditTask,
  onDeleteTask,
  isLoading,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      className={cn(
        'flex flex-col min-h-[400px] lg:min-h-[600px] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl',
        isOver && 'ring-4 ring-blue-500/50 dark:ring-blue-400/50 scale-[1.02] shadow-2xl shadow-blue-500/20'
      )}
    >
      {/* Column Header */}
      <div className={cn('p-3 sm:p-4 bg-gradient-to-r relative overflow-hidden', gradient)}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-semibold text-white drop-shadow-lg truncate">
            {title}
          </h3>
          <span className="bg-white/30 backdrop-blur-sm text-white text-xs sm:text-sm font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full flex-shrink-0 ml-2 shadow-lg ring-1 ring-white/40 animate-pulse-slow">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Column Content */}
      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 p-2 sm:p-3 space-y-2 sm:space-y-3 overflow-y-auto bg-gradient-to-b transition-colors',
          bgGradient,
          isOver && 'bg-blue-100/50 dark:bg-blue-900/30'
        )}
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-400 dark:text-gray-600 text-xs sm:text-sm text-center px-4">
              Drop tasks here
            </div>
          ) : (
            tasks.map((task) => (
              <DraggableTaskCard
                key={task.id}
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
}
