/**
 * Draggable Task Card for Kanban Board
 */
'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, TaskPriority } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Edit2, Trash2, GripVertical, Calendar, AlertCircle, Clock } from 'lucide-react';
import { format, isPast } from 'date-fns';
import { cn } from '@/lib/utils';

interface DraggableTaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  isDragging?: boolean;
}

const priorityConfig = {
  [TaskPriority.HIGH]: {
    badge: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    border: 'border-l-red-500',
    glow: 'shadow-red-500/20',
  },
  [TaskPriority.MEDIUM]: {
    badge: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    border: 'border-l-yellow-500',
    glow: 'shadow-yellow-500/20',
  },
  [TaskPriority.LOW]: {
    badge: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    border: 'border-l-green-500',
    glow: 'shadow-green-500/20',
  },
};

export function DraggableTaskCard({ task, onEdit, onDelete, isDragging = false }: DraggableTaskCardProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isDraggingState,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const config = priorityConfig[task.priority];
  const isOverdue = task.due_date && isPast(new Date(task.due_date)) && task.status !== 'Completed';

  const handleTitleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTitleBlur = () => {
    setIsEditing(false);
    if (editedTitle.trim() && editedTitle !== task.title) {
      // Would trigger update via parent component
      // For now, just reset
      setEditedTitle(task.title);
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleBlur();
    } else if (e.key === 'Escape') {
      setEditedTitle(task.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative',
        isDraggingState && 'opacity-50 z-50'
      )}
      onMouseEnter={() => setShowPreview(true)}
      onMouseLeave={() => setShowPreview(false)}
    >
      <div
        className={cn(
          'relative bg-white dark:bg-gray-800 rounded-lg border-l-4 shadow-md hover:shadow-xl transition-all duration-300',
          config.border,
          config.glow,
          'hover:-translate-y-1 hover:scale-[1.02]',
          isDragging && 'shadow-2xl shadow-blue-500/50 dark:shadow-blue-400/30 rotate-3 scale-105'
        )}
      >
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="absolute left-1 sm:left-2 top-2 cursor-grab active:cursor-grabbing opacity-50 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 touch-none hover:scale-125"
        >
          <GripVertical className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
        </div>

        <div className="p-2.5 sm:p-3 pl-7 sm:pl-8">
          {/* Title - Inline Editable */}
          {isEditing ? (
            <input
              id={`edit-task-title-${task.id}`}
              name="taskTitle"
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              autoFocus
              className="w-full px-2 py-1 text-xs sm:text-sm font-medium bg-gray-50 dark:bg-gray-900 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          ) : (
            <h4
              onDoubleClick={handleTitleDoubleClick}
              className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 mb-1.5 sm:mb-2 cursor-text line-clamp-2"
              title="Double-click to edit"
            >
              {task.title}
            </h4>
          )}

          {/* Description Preview */}
          {task.description && (
            <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 mb-1.5 sm:mb-2 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Metadata */}
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 flex-wrap">
            <Badge className={cn('text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 font-semibold shadow-sm', config.badge)}>
              {task.priority}
            </Badge>

            {task.start_date && (
              <div className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs text-blue-600 dark:text-blue-400">
                <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span className="hidden xs:inline">{format(new Date(task.start_date), 'MMM d')}</span>
                <span className="xs:hidden">{format(new Date(task.start_date), 'M/d')}</span>
              </div>
            )}

            {task.due_date && (
              <div
                className={cn(
                  'flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs',
                  isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
                )}
              >
                {isOverdue && <AlertCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3" />}
                <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span className="hidden xs:inline">{format(new Date(task.due_date), 'MMM d')}</span>
                <span className="xs:hidden">{format(new Date(task.due_date), 'M/d')}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-0.5 sm:gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-300">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(task)}
              className="h-6 sm:h-7 px-1.5 sm:px-2 text-blue-600 dark:text-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/30 dark:hover:to-blue-800/30 hover:scale-110 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <Edit2 className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(task.id)}
              className="h-6 sm:h-7 px-1.5 sm:px-2 text-red-600 dark:text-red-400 hover:bg-gradient-to-br hover:from-red-50 hover:to-red-100 dark:hover:from-red-900/30 dark:hover:to-red-800/30 hover:scale-110 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Hover Preview Tooltip */}
        {showPreview && task.description && (
          <div className="absolute left-full ml-2 top-0 z-50 w-64 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl pointer-events-none">
            <h5 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1">
              {task.title}
            </h5>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {task.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
