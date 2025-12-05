/**
 * Custom hook for product tours using Driver.js
 */
import { useEffect, useState } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export type TourType = 'dashboard' | 'analytics' | 'kanban';

const TOUR_STORAGE_KEY = 'task-tracker-tours-completed';

export function useTour() {
  const [completedTours, setCompletedTours] = useState<Set<TourType>>(new Set());

  useEffect(() => {
    // Load completed tours from localStorage
    const stored = localStorage.getItem(TOUR_STORAGE_KEY);
    if (stored) {
      setCompletedTours(new Set(JSON.parse(stored)));
    }
  }, []);

  const markTourComplete = (tourType: TourType) => {
    const updated = new Set(completedTours);
    updated.add(tourType);
    setCompletedTours(updated);
    localStorage.setItem(TOUR_STORAGE_KEY, JSON.stringify(Array.from(updated)));
  };

  const resetTours = () => {
    setCompletedTours(new Set());
    localStorage.removeItem(TOUR_STORAGE_KEY);
  };

  const isTourCompleted = (tourType: TourType) => {
    return completedTours.has(tourType);
  };

  const startDashboardTour = () => {
    const driverObj = driver({
      showProgress: true,
      showButtons: ['next', 'previous', 'close'],
      steps: [
        {
          popover: {
            title: '👋 Welcome to Task Tracker!',
            description: 'Let\'s take a quick tour of the features. This will only take a minute.'
          }
        },
        {
          element: '[data-tour="create-task"]',
          popover: {
            title: '➕ Create Tasks',
            description: 'Click here to create a new task. You can set title, description, priority, and due dates.',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: '[data-tour="search"]',
          popover: {
            title: '🔍 Search & Filter',
            description: 'Search tasks by title or description. Use filters to view tasks by status or priority.',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: '[data-tour="view-toggle"]',
          popover: {
            title: '📋 View Options',
            description: 'Toggle between List view and Kanban board view for different perspectives of your tasks.',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: '[data-tour="analytics"]',
          popover: {
            title: '📊 Analytics',
            description: 'View your productivity metrics, completion rates, and task insights here.',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: '[data-tour="theme-toggle"]',
          popover: {
            title: '🌓 Dark Mode',
            description: 'Toggle between light and dark themes for comfortable viewing.',
            side: 'left',
            align: 'start'
          }
        },
        {
          popover: {
            title: '🎉 You\'re All Set!',
            description: 'You can restart this tour anytime from the user menu. Happy task tracking!'
          }
        }
      ],
      onDestroyed: () => {
        markTourComplete('dashboard');
      }
    });

    driverObj.drive();
  };

  const startAnalyticsTour = () => {
    const driverObj = driver({
      showProgress: true,
      showButtons: ['next', 'previous', 'close'],
      steps: [
        {
          element: '[data-tour="kpi-cards"]',
          popover: {
            title: '📈 Key Metrics',
            description: 'View your total tasks, completion rate, and task breakdown at a glance.',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: '[data-tour="completion-chart"]',
          popover: {
            title: '📊 Completion Trends',
            description: 'Track your task completion over time. See your productivity patterns.',
            side: 'top',
            align: 'start'
          }
        },
        {
          element: '[data-tour="priority-distribution"]',
          popover: {
            title: '🎯 Priority Distribution',
            description: 'See how your tasks are distributed across priority levels.',
            side: 'top',
            align: 'start'
          }
        }
      ],
      onDestroyed: () => {
        markTourComplete('analytics');
      }
    });

    driverObj.drive();
  };

  const startKanbanTour = () => {
    const driverObj = driver({
      showProgress: true,
      showButtons: ['next', 'previous', 'close'],
      steps: [
        {
          element: '[data-tour="kanban-column"]',
          popover: {
            title: '📋 Kanban Columns',
            description: 'Tasks are organized into columns by status: Not Started, In Progress, and Completed.',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: '[data-tour="task-card"]',
          popover: {
            title: '🎴 Task Cards',
            description: 'Drag and drop cards between columns to change their status. Click to edit or view details.',
            side: 'top',
            align: 'start'
          }
        }
      ],
      onDestroyed: () => {
        markTourComplete('kanban');
      }
    });

    driverObj.drive();
  };

  return {
    startDashboardTour,
    startAnalyticsTour,
    startKanbanTour,
    isTourCompleted,
    resetTours,
    markTourComplete
  };
}
