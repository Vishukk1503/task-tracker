/**
 * Search and filter bar component
 */
'use client';

import { TaskStatus, TaskPriority } from '@/lib/api';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Search, X } from 'lucide-react';

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: TaskStatus | '';
  onStatusChange: (value: TaskStatus | '') => void;
  priority: TaskPriority | '';
  onPriorityChange: (value: TaskPriority | '') => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (value: 'asc' | 'desc') => void;
  onClear: () => void;
}

export function FilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  onClear,
}: FilterBarProps) {
  const hasFilters = search || status || priority || sortBy !== 'created_at' || sortOrder !== 'desc';

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4 transition-colors group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400" />
        <Input
          id="search-tasks"
          name="search"
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-white dark:bg-gray-800/50 backdrop-blur border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <Select id="filter-status" name="status" value={status} onChange={(e) => onStatusChange(e.target.value as TaskStatus | '')} className="bg-white dark:bg-gray-800/50 backdrop-blur border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all">
          <option value="">All Status</option>
          <option value={TaskStatus.NOT_STARTED}>Not Started</option>
          <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
          <option value={TaskStatus.COMPLETED}>Completed</option>
        </Select>

        <Select id="filter-priority" name="priority" value={priority} onChange={(e) => onPriorityChange(e.target.value as TaskPriority | '')} className="bg-white dark:bg-gray-800/50 backdrop-blur border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all">
          <option value="">All Priority</option>
          <option value={TaskPriority.LOW}>Low</option>
          <option value={TaskPriority.MEDIUM}>Medium</option>
          <option value={TaskPriority.HIGH}>High</option>
        </Select>

        <Select id="sort-by" name="sortBy" value={sortBy} onChange={(e) => onSortByChange(e.target.value)} className="bg-white dark:bg-gray-800/50 backdrop-blur border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all">
          <option value="created_at">Created Date</option>
          <option value="updated_at">Updated Date</option>
          <option value="due_date">Due Date</option>
          <option value="priority">Priority</option>
          <option value="status">Status</option>
          <option value="title">Title</option>
        </Select>

        <Select id="sort-order" name="sortOrder" value={sortOrder} onChange={(e) => onSortOrderChange(e.target.value as 'asc' | 'desc')} className="bg-white dark:bg-gray-800/50 backdrop-blur border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all">
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </Select>

        {hasFilters && (
          <Button variant="outline" onClick={onClear} className="flex items-center gap-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
