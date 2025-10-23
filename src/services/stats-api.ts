import api from './http-client';
import type { EntryStats } from '../types';

export const statsApi = {
  getEntryStats: (): Promise<EntryStats[]> =>
    api.get('/stats/entries').then(res => res.data),
};