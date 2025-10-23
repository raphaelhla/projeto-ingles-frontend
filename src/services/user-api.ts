import api from './http-client';
import type { User, ChangePasswordRequest, GenericMessageResponse } from '../types';

export const userApi = {
  getCurrentUser: (): Promise<User> =>
    api.get('/users/me').then(res => res.data),

  changePassword: (data: ChangePasswordRequest): Promise<GenericMessageResponse> =>
    api.patch('/users/me/change-password', data).then(res => res.data),
};