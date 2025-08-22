import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { entryApi, quizApi, statsApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { DashboardStatCard } from '../components/DashboardStatCard';

export const Dashboard = () => {
  const { user } = useAuth();

  const { data: entries } = useQuery({
    queryKey: ['entries', { page: 0, size: 5 }],
    queryFn: () => entryApi.getEntries({ page: 0, size: 5 }),
  });

  const { data: quizzes } = useQuery({
    queryKey: ['quizzes', { page: 0, size: 5 }],
    queryFn: () => quizApi.getQuizzes({ page: 0, size: 5 }),
  });

  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: statsApi.getEntryStats,
  });

  const totalEntries = entries?.totalElements || 0;
  const enabledEntries = entries?.content.filter(entry => entry.enabled).length || 0;
  const totalQuizzes = quizzes?.totalElements || 0;
  const totalCorrect = stats?.reduce((sum, stat) => sum + stat.timesCorrect, 0) || 0;
  const totalAnswered = stats?.reduce((sum, stat) => sum + stat.timesDrawn, 0) || 0;
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  return (
    <div className="px-4 py-6 sm:px-0">
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Bem-vindo, {user?.name}!</h1>
        <p className="mt-1 text-sm text-gray-600">Aqui está um resumo do seu progresso no estudo de inglês.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">

        <DashboardStatCard bgColor="bg-blue-500" title="Total de Palavras/Frases" value={totalEntries}>
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </DashboardStatCard>

        <DashboardStatCard bgColor="bg-green-500" title="Palavras/Frases Ativas" value={enabledEntries}>
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </DashboardStatCard>

        <DashboardStatCard bgColor="bg-purple-500" title="Quizzes Realizados" value={totalQuizzes}>
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </DashboardStatCard>

        <DashboardStatCard bgColor="bg-yellow-500" title="Taxa de Acerto" value={accuracy}>
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </DashboardStatCard>

      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Ações Rápidas</h3>
            <div className="space-y-3">

              <Link
                to="/entries/new"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Adicionar Nova Palavra/Frase
              </Link>
              <Link
                to="/quiz"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Iniciar Quiz
              </Link>

            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Últimos Quizzes</h3>
            {quizzes?.content.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhum quiz realizado ainda.</p>
            ) : (

              <div className="space-y-3">
                {quizzes?.content.slice(0, 3).map((quiz) => (
                  <div key={quiz.id} className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(quiz.startedAt).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-sm text-gray-500">
                        {quiz.score || `${quiz.correctAnswers}/${quiz.totalQuestions}`}
                      </p>
                    </div>
                    <Link
                      to={`/history/${quiz.id}`}
                      className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                    >
                      Ver detalhes
                    </Link>
                  </div>
                ))}
                {(quizzes?.totalElements || 0) > 3 && (
                  <Link
                    to="/history"
                    className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                  >
                    Ver todos os quizzes →
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

