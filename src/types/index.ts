export interface User {
  id: string;
  email: string;
  name: string;
  lastname?: string;
  avatarUrl: string;
  createdAt: string;
  emailVerified: boolean;
  role: string;
  provider: string;
  canChangePassword: boolean;
  isAdmin: boolean;
  isPremiumUser: boolean;
}

export interface Translation {
  id?: string;
  text: string;
}

export interface Entry {
  id: string;
  type: 'WORD' | 'PHRASE';
  text: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  timesDrawn: number;
  timesCorrect: number;
  timesWrong: number;
  translations: Translation[];
}

export interface EntryCreate {
  type: 'WORD' | 'PHRASE';
  text: string;
  translations: Translation[];
}

export interface EntryUpdate {
  text?: string;
  type?: 'WORD' | 'PHRASE';
  enabled?: boolean;
  translations: Translation[];
}

export interface Quiz {
  id: string;
  userId: string;
  startedAt: string;
  finishedAt?: string;
  totalQuestions: number;
  correctAnswers: number;
  score?: string;
  quizItems?: QuizItem[];
}

export interface QuizCreate {
  limit?: number;
}

export interface QuizAnswer {
  entryId: string;
  userAnswer: string;
}

export interface QuizAnswerResponse {
  quizItemId: string;
  entryId: string;
  userAnswer: string;
  isCorrect: boolean;
  correctTranslations: string[];
}

export interface QuizItem {
  quizItemId: string;
  entryId: string;
  entryText: string;
  userAnswer: string;
  isCorrect: boolean;
  correctTranslations: string[];
}

export interface EntryStats {
  id: string;
  text: string;
  type: 'WORD' | 'PHRASE';
  timesDrawn: number;
  timesCorrect: number;
  timesWrong: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string | null;
  expiresIn: number;
  user: User;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface GenericMessageResponse {
  message: string;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

