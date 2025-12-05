/**
 * Task card component displaying individual task
 */
'use client';

import { Task, TaskStatus, TaskPriority } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Edit2, Trash2, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED:
        return 'bg-green-500';
      case TaskStatus.IN_PROGRESS:
        return 'bg-blue-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.HIGH:
        return 'bg-red-100 text-red-800 border-red-200';
      case TaskPriority.MEDIUM:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isDueSoon = (dueDate: string | null) => {
    if (!dueDate) return false;
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 backdrop-blur">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(task.status)} shadow-lg`} />
              <CardTitle className="text-lg truncate dark:text-gray-100">{task.title}</CardTitle>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className={getPriorityColor(task.priority)}>
                {task.priority}
              </Badge>
              <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-200">
                {task.status}
              </Badge>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onEdit(task)}
              className="h-8 w-8"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onDelete(task.id)}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      {(task.description || task.start_date || task.due_date) && (
        <CardContent>
          {task.description && (
            <CardDescription className="mb-3 line-clamp-2 dark:text-gray-400">
              {task.description}
            </CardDescription>
          )}
          <div className="flex flex-col gap-2 text-sm text-muted-foreground dark:text-gray-400">
            {task.start_date && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span className="text-blue-600 dark:text-blue-400">
                  Start: {format(new Date(task.start_date), 'MMM d, yyyy')}
                </span>
              </div>
            )}
            {task.due_date && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span className={
                  isOverdue(task.due_date) 
                    ? 'text-red-600 dark:text-red-400 font-medium'
                    : isDueSoon(task.due_date)
                    ? 'text-orange-600 dark:text-orange-400 font-medium'
                    : ''
                }>
                  Due: {format(new Date(task.due_date), 'MMM d, yyyy h:mm a')}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
