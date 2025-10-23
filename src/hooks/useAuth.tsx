import { useState, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi, userApi, clearAuthTokens } from '../services/api';
import type { User, LoginRequest, RegisterRequest } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  // googleLogin: (data: GoogleLoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem('token')
  );
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: userApi.getCurrentUser,
    enabled: isAuthenticated,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      localStorage.setItem('token', data.accessToken);
      // refreshToken é definido automaticamente no cookie pelo backend
      setIsAuthenticated(true);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      localStorage.setItem('token', data.accessToken);
      // refreshToken é definido automaticamente no cookie pelo backend
      setIsAuthenticated(true);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  // const googleLoginMutation = useMutation({
  //   mutationFn: authApi.googleLogin,
  //   onSuccess: (data) => {
  //     localStorage.setItem('token', data.accessToken);
  //     setIsAuthenticated(true);
  //     queryClient.invalidateQueries({ queryKey: ['user'] });
  //   },
  // });

  const login = async (data: LoginRequest) => {
    await loginMutation.mutateAsync(data);
  };

  const register = async (data: RegisterRequest) => {
    await registerMutation.mutateAsync(data);
  };

  // const googleLogin = async (data: GoogleLoginRequest) => {
  //   await googleLoginMutation.mutateAsync(data);
  // };

  const logoutMutation = useMutation({
    mutationFn: async () => {
      try {
        // Chama o endpoint de logout do backend para limpar o cookie HttpOnly
        await authApi.logout();
      } catch (error) {
        // Mesmo se der erro, limpa o token local
        console.log('Erro no logout do backend:', error);
      } finally {
        // Sempre limpa o token local
        clearAuthTokens();
        queryClient.clear();
      }
    },
    onSuccess: () => {
      navigate('/login');
    }
  });

  const logout = () => {
    logoutMutation.mutate();
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        isAuthenticated,
        login,
        register,
        // googleLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

