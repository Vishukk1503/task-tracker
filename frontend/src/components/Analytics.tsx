/**
 * Analytics dashboard with KPIs and statistics
 */
'use client';

import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/lib/api';
import { 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Calendar,
  Target,
  BarChart3,
  Activity
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color: string;
}

function StatCard({ title, value, icon, trend, color }: StatCardProps) {
  return (
    <div className={`relative overflow-hidden rounded-xl border ${color} backdrop-blur-sm p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl group`}>
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-gray-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${color.includes('blue') ? 'bg-blue-100 dark:bg-blue-900/30' : color.includes('green') ? 'bg-green-100 dark:bg-green-900/30' : color.includes('purple') ? 'bg-purple-100 dark:bg-purple-900/30' : color.includes('orange') ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
            {icon}
          </div>
          {trend && (
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 px-2 py-1 rounded-full">
              {trend}
            </span>
          )}
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

interface ProgressBarProps {
  label: string;
  value: number;
  total: number;
  color: string;
}

function ProgressBar({ label, value, total, color }: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <span className="text-gray-600 dark:text-gray-400">{value} ({percentage}%)</span>
      </div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500 ease-out relative overflow-hidden`}
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  );
}

export function Analytics() {
  const { data: kpis, isLoading, error } = useQuery({
    queryKey: ['analytics-kpis'],
    queryFn: async () => {
      const response = await analyticsApi.getKPIs();
      return response.data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400" />
      </div>
    );
  }

  if (error || !kpis) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Failed to load analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Track your productivity and performance</p>
        </div>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tasks"
          value={kpis.total_tasks}
          icon={<Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
          color="border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-900/20 dark:to-blue-800/10"
        />
        
        <StatCard
          title="Completion Rate"
          value={`${kpis.completion_rate}%`}
          icon={<Target className="w-5 h-5 text-green-600 dark:text-green-400" />}
          trend={kpis.completion_rate >= 70 ? '🎯 Great!' : kpis.completion_rate >= 50 ? '👍 Good' : '📈 Keep going'}
          color="border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50/50 to-green-100/30 dark:from-green-900/20 dark:to-green-800/10"
        />
        
        <StatCard
          title="Avg. Completion Time"
          value={kpis.average_completion_days > 0 ? `${kpis.average_completion_days} days` : 'N/A'}
          icon={<Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
          color="border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50/50 to-purple-100/30 dark:from-purple-900/20 dark:to-purple-800/10"
        />
        
        <StatCard
          title="Overdue Tasks"
          value={kpis.overdue_tasks}
          icon={<AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />}
          trend={kpis.overdue_tasks === 0 ? '✨ Perfect' : '⚠️ Action needed'}
          color="border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50/50 to-orange-100/30 dark:from-orange-900/20 dark:to-orange-800/10"
        />
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status Breakdown */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-2 mb-6">
            <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Task Status</h3>
          </div>
          
          <div className="space-y-4">
            <ProgressBar
              label="Not Started"
              value={kpis.not_started_tasks}
              total={kpis.total_tasks}
              color="bg-gradient-to-r from-gray-400 to-gray-500 dark:from-gray-500 dark:to-gray-600"
            />
            <ProgressBar
              label="In Progress"
              value={kpis.in_progress_tasks}
              total={kpis.total_tasks}
              color="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500"
            />
            <ProgressBar
              label="Completed"
              value={kpis.completed_tasks}
              total={kpis.total_tasks}
              color="bg-gradient-to-r from-green-500 to-green-600 dark:from-green-400 dark:to-green-500"
            />
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm p-6 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Priority Distribution</h3>
          </div>
          
          <div className="space-y-4">
            <ProgressBar
              label="High Priority"
              value={kpis.tasks_by_priority.High}
              total={kpis.total_tasks}
              color="bg-gradient-to-r from-red-500 to-red-600 dark:from-red-400 dark:to-red-500"
            />
            <ProgressBar
              label="Medium Priority"
              value={kpis.tasks_by_priority.Medium}
              total={kpis.total_tasks}
              color="bg-gradient-to-r from-yellow-500 to-yellow-600 dark:from-yellow-400 dark:to-yellow-500"
            />
            <ProgressBar
              label="Low Priority"
              value={kpis.tasks_by_priority.Low}
              total={kpis.total_tasks}
              color="bg-gradient-to-r from-green-500 to-green-600 dark:from-green-400 dark:to-green-500"
            />
          </div>
        </div>
      </div>

      {/* Weekly Performance */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white/50 to-blue-50/30 dark:from-gray-800/30 dark:to-blue-900/10 backdrop-blur-sm p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">This Week's Performance</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Tasks Completed This Week</p>
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{kpis.this_week_completed}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">On-Time Completion Rate</p>
            <p className="text-4xl font-bold text-green-600 dark:text-green-400">{kpis.on_time_completion_rate}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
