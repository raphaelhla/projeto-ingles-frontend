import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { quizApi } from '../services/api';

export const QuizDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: quiz, isLoading } = useQuery({
    queryKey: ['quiz', id],
    queryFn: () => quizApi.getQuiz(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-sm font-medium text-gray-900">Quiz não encontrado</h3>
        <p className="mt-1 text-sm text-gray-500">
          O quiz que você está procurando não existe ou foi removido.
        </p>
        <div className="mt-6">
          <Link
            to="/history"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Voltar ao Histórico
          </Link>
        </div>
      </div>
    );
  }

  const startDate = new Date(quiz.startedAt);
  const finishDate = quiz.finishedAt ? new Date(quiz.finishedAt) : null;
  const duration = finishDate 
    ? Math.round((finishDate.getTime() - startDate.getTime()) / 1000 / 60)
    : null;
  const accuracy = quiz.totalQuestions > 0 
    ? Math.round((quiz.correctAnswers / quiz.totalQuestions) * 100)
    : 0;

  const correctItems = quiz.quizItems?.filter(item => item.isCorrect) || [];
  const incorrectItems = quiz.quizItems?.filter(item => !item.isCorrect) || [];

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <Link
          to="/history"
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar ao Histórico
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Detalhes do Quiz
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Resultados e respostas do quiz realizado em {startDate.toLocaleDateString('pt-BR')}.
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Data e Hora</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {startDate.toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })} às {startDate.toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {quiz.finishedAt ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Finalizado
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Em andamento
                  </span>
                )}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Pontuação</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {quiz.correctAnswers} de {quiz.totalQuestions} questões corretas ({accuracy}%)
              </dd>
            </div>
            {duration && (
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Duração</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {duration} minuto{duration !== 1 ? 's' : ''}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {quiz.quizItems && quiz.quizItems.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Respostas</h3>
          
          {/* Summary */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 mb-6">
            <div className="bg-green-50 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-green-700 truncate">
                        Respostas Corretas
                      </dt>
                      <dd className="text-lg font-medium text-green-900">
                        {correctItems.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-50 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-red-700 truncate">
                        Respostas Incorretas
                      </dt>
                      <dd className="text-lg font-medium text-red-900">
                        {incorrectItems.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Incorrect Answers */}
          {incorrectItems.length > 0 && (
            <div className="mb-8">
              <h4 className="text-md font-medium text-red-900 mb-4">
                Respostas Incorretas ({incorrectItems.length})
              </h4>
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {incorrectItems.map((item) => (
                    <li key={item.quizItemId} className="px-4 py-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {item.entryText}
                          </p>
                          <div className="mt-2 space-y-1">
                            <div>
                              <span className="text-xs font-medium text-red-700">Sua resposta:</span>
                              <span className="ml-2 text-sm text-red-600">{item.userAnswer}</span>
                            </div>
                            <div>
                              <span className="text-xs font-medium text-green-700">
                                {item.correctTranslations.length > 1 ? 'Respostas corretas:' : 'Resposta correta:'}
                              </span>
                              <div className="ml-2 text-sm text-green-600">
                                {item.correctTranslations.join(', ')}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0 ml-4">
                          <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Correct Answers */}
          {correctItems.length > 0 && (
            <div>
              <h4 className="text-md font-medium text-green-900 mb-4">
                Respostas Corretas ({correctItems.length})
              </h4>
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {correctItems.map((item) => (
                    <li key={item.quizItemId} className="px-4 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {item.entryText}
                          </p>
                          <p className="text-sm text-green-600 mt-1">
                            {item.userAnswer}
                          </p>
                        </div>
                        <div className="flex-shrink-0 ml-4">
                          <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

