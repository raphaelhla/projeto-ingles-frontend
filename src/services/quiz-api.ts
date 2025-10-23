import api from './http-client';
import type { Quiz, QuizCreate, QuizAnswer, QuizAnswerResponse, PaginatedResponse } from '../types';

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