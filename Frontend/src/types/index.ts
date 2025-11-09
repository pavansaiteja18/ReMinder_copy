export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'member';
  createdAt: string;
}

export interface Task {
    _id?: string;  
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  owner: string;
  assignedTo?: string;
  deadline?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  attachments?: string[];
  comments?: Comment[];
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  reactions?: Record<string, string[]>;
}

export interface ExtractedTask {
  title: string;
  owner: string;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

export interface RecallResult {
  answer: string;
  sources: {
    id: string;
    title: string;
    date: string;
    excerpt: string;
  }[];
}

export interface TeamsIntegration {
  connected: boolean;
  webhookUrl?: string;
  autoNotify: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

export interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
   updateTask: (id: string, updates: Partial<Task>) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  moveTask: (id: string, status: Task['status']) => Promise<void>;
  clearTasks: () => void;
}
