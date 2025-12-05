/**
 * Footer component with version and copyright
 */
'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Heart } from 'lucide-react';

export default function Footer() {
  const { isDark } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            ADHD Task Tracker
          </div>
          
          <div className="flex items-center gap-4">
            <span>© {currentYear} Task Tracker</span>
            <span className="hidden md:inline">•</span>
            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">
              v1.0.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
