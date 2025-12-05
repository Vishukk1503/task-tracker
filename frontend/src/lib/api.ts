/**
 * API client configuration and types
 */
import axios from 'axios';

// Force rebuild to pick up env vars
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Types
export enum TaskStatus {
  NOT_STARTED = "Not Started",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed"
}

export enum TaskPriority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High"
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  start_date: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  user_id: number;
}

export interface TaskCreate {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  start_date?: string;
  due_date?: string;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  start_date?: string;
  due_date?: string;
}

export interface TaskListResponse {
  tasks: Task[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface User {
  id: number;
  email: string;
  username: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
}

// API functions
export const authApi = {
  register: (data: RegisterData) => 
    api.post<AuthResponse>('/auth/register', data),
  
  login: (credentials: LoginCredentials) => 
    api.post<AuthResponse>('/auth/login', credentials),
  
  getCurrentUser: () => 
    api.get<User>('/auth/me'),
};

export interface KPIs {
  total_tasks: number;
  completed_tasks: number;
  in_progress_tasks: number;
  not_started_tasks: number;
  completion_rate: number;
  average_completion_days: number;
  overdue_tasks: number;
  tasks_by_priority: {
    High: number;
    Medium: number;
    Low: number;
  };
  tasks_by_status: {
    "Not Started": number;
    "In Progress": number;
    Completed: number;
  };
  this_week_completed: number;
  on_time_completion_rate: number;
}

export const tasksApi = {
  getTasks: (params?: {
    page?: number;
    page_size?: number;
    search?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
  }) => api.get<TaskListResponse>('/tasks/', { params }),
  
  getTask: (id: number) => 
    api.get<Task>(`/tasks/${id}`),
  
  createTask: (task: TaskCreate) => 
    api.post<Task>('/tasks/', task),
  
  updateTask: (id: number, task: TaskUpdate) => 
    api.put<Task>(`/tasks/${id}`, task),
  
  deleteTask: (id: number) => 
    api.delete(`/tasks/${id}`),
};

export const analyticsApi = {
  getKPIs: () => api.get<KPIs>('/analytics/kpis'),
};
