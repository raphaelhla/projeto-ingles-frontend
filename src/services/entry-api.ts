import api from './http-client';
import type { Entry, EntryCreate, EntryUpdate, PaginatedResponse } from '../types';

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