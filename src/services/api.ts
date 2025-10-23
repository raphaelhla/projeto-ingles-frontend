// Central barrel export - mantém compatibilidade com imports existentes
export { default as api } from './http-client';
export { clearAuthTokens } from './http-client';
export { authApi } from './auth-api';
export { userApi } from './user-api';
export { entryApi } from './entry-api';
export { quizApi } from './quiz-api';
export { statsApi } from './stats-api';

// Export default para compatibilidade
export { default } from './http-client';

