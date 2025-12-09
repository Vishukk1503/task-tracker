/**
 * Main dashboard page with task list
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi, Task, TaskCreate, TaskUpdate, TaskStatus, TaskPriority } from '@/lib/api';
import { TaskCard } from '@/components/TaskCard';
import { TaskForm } from '@/components/TaskForm';
import { FilterBar } from '@/components/FilterBar';
import { KanbanBoard } from '@/components/KanbanBoard';
import { Analytics } from '@/components/Analytics';
import { Button } from '@/components/ui/Button';
import { Plus, Loader2, Moon, Sun, LayoutGrid, Kanban, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useTour } from '@/hooks/useTour';
import Footer from '@/components/Footer';

export function TaskDashboard() {
  const { user, logout, refreshUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { startDashboardTour, isTourCompleted } = useTour();

  // State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | ''>('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'list' | 'kanban' | 'analytics'>('list');

  // Load view mode from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('taskViewMode');
    if (saved === 'list' || saved === 'kanban' || saved === 'analytics') {
      setViewMode(saved);
    }
  }, []);

  // Refresh user data on mount
  useEffect(() => {
    refreshUser();
  }, []);

  // Start tour on first visit
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isTourCompleted('dashboard')) {
        startDashboardTour();
      }
    }, 1000); // Delay to let page render

    return () => clearTimeout(timer);
  }, [isTourCompleted, startDashboardTour]);

  // Save view mode to localStorage
  const setView = (mode: 'list' | 'kanban' | 'analytics') => {
    setViewMode(mode);
    localStorage.setItem('taskViewMode', mode);
  };

  // Queries
  const { data: tasksData, isLoading } = useQuery({
    queryKey: ['tasks', page, search, statusFilter, priorityFilter, sortBy, sortOrder, viewMode],
    queryFn: () => tasksApi.getTasks({
      page: viewMode === 'kanban' ? 1 : page,
      page_size: viewMode === 'kanban' ? 100 : 12, // Fetch all tasks for Kanban view
      search: search || undefined,
      status: statusFilter || undefined,
      priority: priorityFilter || undefined,
      sort_by: sortBy,
      sort_order: sortOrder,
    }).then(res => res.data),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: TaskCreate) => tasksApi.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task created successfully!');
      setIsFormOpen(false);
    },
    onError: (error: any) => {
      const errorMessage = typeof error.response?.data?.detail === 'string'
        ? error.response.data.detail
        : Array.isArray(error.response?.data?.detail)
        ? error.response.data.detail.map((e: any) => e.msg).join(', ')
        : 'Failed to create task';
      toast.error(errorMessage);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: TaskUpdate }) => 
      tasksApi.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task updated successfully!');
      setIsFormOpen(false);
      setEditingTask(undefined);
    },
    onError: (error: any) => {
      const errorMessage = typeof error.response?.data?.detail === 'string'
        ? error.response.data.detail
        : Array.isArray(error.response?.data?.detail)
        ? error.response.data.detail.map((e: any) => e.msg).join(', ')
        : 'Failed to update task';
      toast.error(errorMessage);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => tasksApi.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task deleted successfully!');
    },
    onError: (error: any) => {
      const errorMessage = typeof error.response?.data?.detail === 'string'
        ? error.response.data.detail
        : Array.isArray(error.response?.data?.detail)
        ? error.response.data.detail.map((e: any) => e.msg).join(', ')
        : 'Failed to delete task';
      toast.error(errorMessage);
    },
  });

  // Handlers
  const handleCreateTask = (data: TaskCreate) => {
    createMutation.mutate(data);
  };

  const handleUpdateTask = (data: TaskUpdate) => {
    if (editingTask) {
      updateMutation.mutate({ id: editingTask.id, data });
    }
  };

  const handleFormSubmit = (data: TaskCreate | TaskUpdate) => {
    if (editingTask) {
      handleUpdateTask(data as TaskUpdate);
    } else {
      handleCreateTask(data as TaskCreate);
    }
  };

  const handleDeleteTask = (id: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setTimeout(() => setEditingTask(undefined), 200);
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setPriorityFilter('');
    setSortBy('created_at');
    setSortOrder('desc');
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-950/20 dark:to-purple-950/20 transition-all duration-500 animate-in fade-in flex flex-col">
      {/* Header */}
      <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-10 shadow-lg shadow-gray-200/50 dark:shadow-gray-950/50 transition-all duration-300">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="min-w-0 flex-shrink">
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent truncate animate-pulse-slow">
                Task Tracker
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">Welcome, {user?.username}!</p>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={() => setView('list')}
                className={`rounded-full hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-950/50 dark:hover:to-purple-950/50 transition-all duration-300 h-8 w-8 sm:h-10 sm:w-10 hover:scale-110 hover:shadow-lg ${viewMode === 'list' ? 'bg-blue-100 dark:bg-blue-900/30' : ''}`}
                title="List View"
                data-tour="view-toggle"
              >
                <LayoutGrid className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 dark:text-gray-300" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={() => setView('kanban')}
                className={`rounded-full hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-950/50 dark:hover:to-pink-950/50 transition-all duration-300 h-8 w-8 sm:h-10 sm:w-10 hover:scale-110 hover:shadow-lg ${viewMode === 'kanban' ? 'bg-purple-100 dark:bg-purple-900/30' : ''}`}
                title="Kanban View"
              >
                <Kanban className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 dark:text-gray-300" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={() => setView('analytics')}
                className={`rounded-full hover:bg-gradient-to-br hover:from-green-50 hover:to-teal-50 dark:hover:from-green-950/50 dark:hover:to-teal-950/50 transition-all duration-300 h-8 w-8 sm:h-10 sm:w-10 hover:scale-110 hover:shadow-lg ${viewMode === 'analytics' ? 'bg-green-100 dark:bg-green-900/30' : ''}`}
                title="Analytics View"
                data-tour="analytics"
              >
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 dark:text-gray-300" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={toggleTheme}
                className="rounded-full hover:bg-gradient-to-br hover:from-yellow-50 hover:to-orange-50 dark:hover:from-yellow-950/30 dark:hover:to-orange-950/30 transition-all duration-300 h-8 w-8 sm:h-10 sm:w-10 hover:scale-110 hover:shadow-lg"
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                data-tour="theme-toggle"
              >
                {isDark ? (
                  <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
                )}
              </Button>
              <Button onClick={() => setIsFormOpen(true)} className="items-center gap-1 sm:gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 shadow-lg shadow-blue-500/30 dark:shadow-blue-400/20 hover:shadow-xl hover:shadow-blue-500/50 dark:hover:shadow-blue-400/30 transition-all duration-300 hover:scale-105 text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-10 hidden xs:flex" data-tour="create-task">
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">New Task</span>
                <span className="sm:hidden">New</span>
              </Button>
              <Button 
                size="icon"
                onClick={() => setIsFormOpen(true)} 
                className="bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-110 h-8 w-8 xs:hidden"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                onClick={startDashboardTour}
                className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-10 hidden sm:flex"
                title="Take a tour of the features"
              >
                🎯 Tour
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/profile')}
                className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-10 hidden sm:flex"
              >
                Profile
              </Button>
              <Button variant="outline" onClick={logout} className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-10 hidden sm:flex">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 flex-1">
        {/* Verification Banner */}
        {user && (user as any).is_verified === 0 && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="text-yellow-600 dark:text-yellow-400">⚠️</div>
              <div>
                <p className="font-medium text-yellow-900 dark:text-yellow-200">Please verify your email</p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Check your inbox for the verification link or{' '}
                  <button
                    onClick={() => router.push('/profile')}
                    className="underline hover:text-yellow-900 dark:hover:text-yellow-100 font-medium"
                  >
                    resend verification email
                  </button>
                  {' '}from your profile.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Filters - Only show in List view */}
        {viewMode === 'list' && (
          <div className="mb-6" data-tour="search">
            <FilterBar
              search={search}
              onSearchChange={setSearch}
              status={statusFilter}
              onStatusChange={setStatusFilter}
              priority={priorityFilter}
              onPriorityChange={setPriorityFilter}
              sortBy={sortBy}
              onSortByChange={setSortBy}
              sortOrder={sortOrder}
              onSortOrderChange={setSortOrder}
              onClear={handleClearFilters}
            />
          </div>
        )}

        {/* Stats */}
        {tasksData && viewMode === 'list' && (
          <div className="mb-6 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="font-medium">
              Showing {tasksData.tasks.length} of {tasksData.total} tasks
            </div>
            <div className="font-medium">
              Page {tasksData.page} of {tasksData.total_pages}
            </div>
          </div>
        )}

        {/* View Content */}
        {viewMode === 'analytics' ? (
          /* Analytics View */
          <Analytics />
        ) : isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
          </div>
        ) : tasksData?.tasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">No tasks found</p>
            <Button onClick={() => setIsFormOpen(true)} variant="outline">
              Create Your First Task
            </Button>
          </div>
        ) : viewMode === 'kanban' ? (
          /* Kanban View */
          <KanbanBoard
            tasks={tasksData?.tasks || []}
            onUpdateTask={(id, data) => updateMutation.mutate({ id, data })}
            onEditTask={handleEditClick}
            onDeleteTask={handleDeleteTask}
            isLoading={updateMutation.isPending}
          />
        ) : (
          /* List View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {tasksData?.tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEditClick}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}

        {/* Pagination - Only in List view */}
        {viewMode === 'list' && tasksData && tasksData.total_pages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="px-4 py-2 text-sm">
              Page {page} of {tasksData.total_pages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.min(tasksData.total_pages, p + 1))}
              disabled={page === tasksData.total_pages}
            >
              Next
            </Button>
          </div>
        )}
      </main>

      {/* Task Form Modal */}
      <TaskForm
        open={isFormOpen}
        onOpenChange={handleFormClose}
        onSubmit={handleFormSubmit}
        task={editingTask}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
