import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export const entrySchema = z.object({
  type: z.enum(['WORD', 'PHRASE'], {
    required_error: 'Tipo é obrigatório',
  }),
  text: z.string().min(1, 'Texto é obrigatório'),
  translations: z.array(
    z.object({
      text: z.string().min(1, 'Tradução é obrigatória'),
    })
  ).min(1, 'Pelo menos uma tradução é obrigatória'),
});

export const quizAnswerSchema = z.object({
  userAnswer: z.string().min(1, 'Resposta é obrigatória'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type EntryFormData = z.infer<typeof entrySchema>;
export type QuizAnswerFormData = z.infer<typeof quizAnswerSchema>;

