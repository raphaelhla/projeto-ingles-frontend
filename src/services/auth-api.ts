import api from './http-client';
import type { LoginRequest, RegisterRequest, AuthResponse } from '../types';

export const authApi = {
  login: (data: LoginRequest): Promise<AuthResponse> =>
    api.post('/auth/login', data).then(res => res.data),
  
  register: (data: RegisterRequest): Promise<AuthResponse> =>
    api.post('/auth/register', data).then(res => res.data),
  
  refreshToken: (): Promise<AuthResponse> =>
    api.post('/auth/refresh-token').then(res => res.data),
  
  logout: (): Promise<void> =>
    api.post('/auth/logout').then(() => {}),
  
  // googleLogin: (data: GoogleLoginRequest): Promise<GoogleAuthResponse> =>
  //   api.post('/auth/google2', data).then(res => res.data),
};