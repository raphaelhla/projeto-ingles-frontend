import axios from 'axios';
import type { 
  User, 
  Entry, 
  EntryCreate, 
  EntryUpdate, 
  Quiz, 
  QuizCreate, 
  QuizAnswer, 
  QuizAnswerResponse, 
  EntryStats, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse,
  PaginatedResponse
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (data: LoginRequest): Promise<AuthResponse> =>
    api.post('/auth/login', data).then(res => res.data),
  
  register: (data: RegisterRequest): Promise<User> =>
    api.post('/auth/register', data).then(res => res.data),
};

// User API
export const userApi = {
  getCurrentUser: (): Promise<User> =>
    api.get('/users/me').then(res => res.data),
};

// Entry API
export const entryApi = {
  getEntries: (params?: { enabled?: boolean; q?: string; page?: number; size?: number }): Promise<PaginatedResponse<Entry>> =>
    api.get('/entries', { params }).then(res => res.data),
  
  getEntry: (id: string): Promise<Entry> =>
    api.get(`/entries/${id}`).then(res => res.data),
  
  createEntry: (data: EntryCreate): Promise<Entry> =>
    api.post('/entries', data).then(res => res.data),
  
  updateEntry: (id: string, data: EntryUpdate): Promise<Entry> =>
    api.put(`/entries/${id}`, data).then(res => res.data),
  
  toggleEntry: (id: string): Promise<Entry> =>
    api.patch(`/entries/${id}/toggle`).then(res => res.data),
  
  deleteEntry: (id: string): Promise<void> =>
    api.delete(`/entries/${id}`).then(() => {}),
};

// Quiz API
export const quizApi = {
  createQuiz: (data?: QuizCreate): Promise<Quiz> =>
    api.post('/quizzes', data).then(res => res.data),
  
  answerQuestion: (quizId: string, data: QuizAnswer): Promise<QuizAnswerResponse> =>
    api.post(`/quizzes/${quizId}/answer`, data).then(res => res.data),
  
  finishQuiz: (quizId: string): Promise<Quiz> =>
    api.post(`/quizzes/${quizId}/finish`).then(res => res.data),
  
  getQuizzes: (params?: { page?: number; size?: number }): Promise<PaginatedResponse<Quiz>> =>
    api.get('/quizzes', { params }).then(res => res.data),
  
  getQuiz: (id: string): Promise<Quiz> =>
    api.get(`/quizzes/${id}`).then(res => res.data),
};

// Stats API
export const statsApi = {
  getEntryStats: (): Promise<EntryStats[]> =>
    api.get('/stats/entries').then(res => res.data),
};

export default api;

