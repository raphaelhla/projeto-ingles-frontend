import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper function para limpar tokens
export const clearAuthTokens = () => {
  localStorage.removeItem('token');
  // Não precisa remover cookie HttpOnly - o backend faz isso
};

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Sempre enviar cookies (incluindo HttpOnly)
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

// Flag para evitar múltiplas tentativas de refresh simultâneas
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: any) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// Response interceptor com refresh token automático
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Se já está tentando fazer refresh, adiciona à fila
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          if (token) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Chama o endpoint de refresh
        // O refreshToken é enviado automaticamente via cookie HttpOnly
        const response = await api.post('/auth/refresh-token', {});
        
        const { accessToken } = response.data;
        
        // Salva o novo accessToken
        localStorage.setItem('token', accessToken);
        
        // Atualiza o header da requisição original
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        processQueue(null, accessToken);
        
        return api(originalRequest);
        
      } catch (refreshError: any) {
        processQueue(refreshError, null);
        
        // Se retornou 403, o refreshToken expirou
        if (refreshError.response?.status === 403) {
          console.log('RefreshToken expirado, redirecionando para login');
        } else {
          console.log('Erro no refresh, redirecionando para login');
        }
        
        // Limpa tokens e redireciona para login
        clearAuthTokens();
        window.location.href = '/login';
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;