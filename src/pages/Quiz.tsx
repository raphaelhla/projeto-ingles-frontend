import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { quizApi, entryApi } from '../services/api';
import { quizAnswerSchema, type QuizAnswerFormData } from '../utils/validation';
import type { Quiz, Entry, QuizAnswerResponse } from '../types';

export const QuizPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [availableEntries, setAvailableEntries] = useState<Entry[]>([]);
  const [currentEntryIndex, setCurrentEntryIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswerResponse[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [quizLimit, setQuizLimit] = useState<number | undefined>(undefined);

  const { data: entries } = useQuery({
    queryKey: ['entries', { enabled: true }],
    queryFn: () => entryApi.getEntries({ enabled: true, size: 1000 }),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuizAnswerFormData>({
    resolver: zodResolver(quizAnswerSchema),
  });

  const createQuizMutation = useMutation({
    mutationFn: quizApi.createQuiz,
    onSuccess: (quiz) => {
      setCurrentQuiz(quiz);
      if (entries?.content) {
        const enabledEntries = entries.content.filter(e => e.enabled);
        const shuffled = [...enabledEntries].sort(() => Math.random() - 0.5);
        const limited = quizLimit ? shuffled.slice(0, quizLimit) : shuffled;
        setAvailableEntries(limited);
      }
    },
  });

  const answerMutation = useMutation({
    mutationFn: ({ quizId, answer }: { quizId: string; answer: any }) =>
      quizApi.answerQuestion(quizId, answer),
    onSuccess: (response) => {
      setAnswers(prev => [...prev, response]);
      setShowResult(true);
      reset();
    },
  });

  const finishQuizMutation = useMutation({
    mutationFn: quizApi.finishQuiz,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      navigate('/history');
    },
  });

  const startQuiz = () => {
    createQuizMutation.mutate(quizLimit ? { limit: quizLimit } : {});
  };

  const onSubmit = (data: QuizAnswerFormData) => {
    if (!currentQuiz || !currentEntry) return;

    answerMutation.mutate({
      quizId: currentQuiz.id,
      answer: {
        entryId: currentEntry.id,
        userAnswer: data.userAnswer,
      },
    });
  };

  const nextQuestion = () => {
    setShowResult(false);
    setCurrentEntryIndex(prev => prev + 1);
  };

  const finishQuiz = () => {
    if (currentQuiz) {
      finishQuizMutation.mutate(currentQuiz.id);
    }
  };

  const currentEntry = availableEntries[currentEntryIndex];
  const isLastQuestion = currentEntryIndex >= availableEntries.length - 1;
  const currentAnswer = answers[answers.length - 1];

  if (!currentQuiz) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="max-w-2xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Iniciar Quiz
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Teste seus conhecimentos com as palavras e frases que você cadastrou.
            </p>

            {entries?.content.filter(e => e.enabled).length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Nenhuma palavra/frase ativa encontrada
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        Você precisa ter pelo menos uma palavra ou frase ativa para iniciar um quiz.
                      </p>
                    </div>
                    <div className="mt-4">
                      <div className="-mx-2 -my-1.5 flex">
                        <button
                          onClick={() => navigate('/entries')}
                          className="bg-yellow-50 px-2 py-1.5 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-50 focus:ring-yellow-600"
                        >
                          Gerenciar Palavras/Frases
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg p-6">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Limite de questões (opcional)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={entries?.content.filter(e => e.enabled).length || 100}
                    value={quizLimit || ''}
                    onChange={(e) => setQuizLimit(e.target.value ? parseInt(e.target.value) : undefined)}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder={`Máximo: ${entries?.content.filter(e => e.enabled).length || 0}`}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Deixe em branco para usar todas as {entries?.content.filter(e => e.enabled).length || 0} palavras/frases ativas.
                  </p>
                </div>
                <button
                  onClick={startQuiz}
                  disabled={createQuizMutation.isPending}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {createQuizMutation.isPending ? 'Iniciando...' : 'Iniciar Quiz'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!currentEntry) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Quiz Finalizado!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Parabéns! Você completou todas as questões.
          </p>
          <button
            onClick={finishQuiz}
            className="inline-flex items-center px-6 py-3 border border-transparent text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Ver Resultados
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Questão {currentEntryIndex + 1} de {availableEntries.length}</span>
            <span>{answers.filter(a => a.isCorrect).length} acertos</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentEntryIndex + 1) / availableEntries.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {!showResult ? (
          /* Question */
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-center mb-6">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                currentEntry.type === 'WORD' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {currentEntry.type === 'WORD' ? 'Palavra' : 'Frase'}
              </span>
            </div>
            
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {currentEntry.text}
              </h2>
              <p className="text-lg text-gray-600">
                Como você traduziria isso para o português?
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <input
                  type="text"
                  {...register('userAnswer')}
                  className="block w-full text-lg border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Digite sua resposta..."
                  autoFocus
                />
                {errors.userAnswer && (
                  <p className="mt-1 text-sm text-red-600">{errors.userAnswer.message}</p>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={finishQuiz}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Finalizar Quiz
                </button>
                <button
                  type="submit"
                  disabled={answerMutation.isPending}
                  className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {answerMutation.isPending ? 'Verificando...' : 'Responder'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Result */
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-center mb-6">
              <div className={`mx-auto h-16 w-16 rounded-full flex items-center justify-center ${
                currentAnswer.isCorrect ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {currentAnswer.isCorrect ? (
                  <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <h3 className={`mt-4 text-xl font-medium ${
                currentAnswer.isCorrect ? 'text-green-900' : 'text-red-900'
              }`}>
                {currentAnswer.isCorrect ? 'Correto!' : 'Incorreto'}
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Sua resposta:</p>
                <p className="text-lg text-gray-900">{currentAnswer.userAnswer}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {currentAnswer.correctTranslations.length > 1 ? 'Respostas corretas:' : 'Resposta correta:'}
                </p>
                <div className="space-y-1">
                  {currentAnswer.correctTranslations.map((translation, index) => (
                    <p key={index} className="text-lg text-green-600">{translation}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={finishQuiz}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Finalizar Quiz
              </button>
              <button
                onClick={nextQuestion}
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isLastQuestion ? 'Finalizar' : 'Próxima Questão'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

