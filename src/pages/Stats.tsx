import { useQuery } from '@tanstack/react-query';
import { statsApi } from '../services/api';

export const Stats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: statsApi.getEntryStats,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats || stats.length === 0) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Estatísticas</h1>
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma estatística disponível</h3>
          <p className="mt-1 text-sm text-gray-500">
            Faça alguns quizzes para ver suas estatísticas aqui.
          </p>
        </div>
      </div>
    );
  }

  // Calculate overall statistics
  const totalEntries = stats.length;
  const totalDrawn = stats.reduce((sum, stat) => sum + stat.timesDrawn, 0);
  const totalCorrect = stats.reduce((sum, stat) => sum + stat.timesCorrect, 0);
  const totalWrong = stats.reduce((sum, stat) => sum + stat.timesWrong, 0);
  const overallAccuracy = totalDrawn > 0 ? Math.round((totalCorrect / totalDrawn) * 100) : 0;

  // Sort entries by different criteria
  const mostDrawn = [...stats].sort((a, b) => b.timesDrawn - a.timesDrawn).slice(0, 5);
  const mostCorrect = [...stats].sort((a, b) => b.timesCorrect - a.timesCorrect).slice(0, 5);
  const mostWrong = [...stats].sort((a, b) => b.timesWrong - a.timesWrong).slice(0, 5);
  const bestAccuracy = [...stats]
    .filter(stat => stat.timesDrawn >= 3) // Only entries with at least 3 attempts
    .sort((a, b) => {
      const accuracyA = a.timesDrawn > 0 ? (a.timesCorrect / a.timesDrawn) : 0;
      const accuracyB = b.timesDrawn > 0 ? (b.timesCorrect / b.timesDrawn) : 0;
      return accuracyB - accuracyA;
    })
    .slice(0, 5);

  const worstAccuracy = [...stats]
    .filter(stat => stat.timesDrawn >= 3) // Only entries with at least 3 attempts
    .sort((a, b) => {
      const accuracyA = a.timesDrawn > 0 ? (a.timesCorrect / a.timesDrawn) : 0;
      const accuracyB = b.timesDrawn > 0 ? (b.timesCorrect / b.timesDrawn) : 0;
      return accuracyA - accuracyB;
    })
    .slice(0, 5);

  return (
    <div className="px-4 py-6 sm:px-0">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Estatísticas</h1>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total de Entradas
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {totalEntries}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Sorteadas
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {totalDrawn}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total de Acertos
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {totalCorrect}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Taxa de Acerto Geral
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {overallAccuracy}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Tables */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Most Drawn */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Mais Sorteadas
            </h3>
            <div className="space-y-3">
              {mostDrawn.map((stat, index) => (
                <div key={stat.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 w-6">
                      {index + 1}.
                    </span>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{stat.text}</p>
                      <p className="text-xs text-gray-500">
                        {stat.type === 'WORD' ? 'Palavra' : 'Frase'}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {stat.timesDrawn}x
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Best Accuracy */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Melhor Taxa de Acerto
            </h3>
            <div className="space-y-3">
              {bestAccuracy.map((stat, index) => {
                const accuracy = stat.timesDrawn > 0 ? Math.round((stat.timesCorrect / stat.timesDrawn) * 100) : 0;
                return (
                  <div key={stat.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-500 w-6">
                        {index + 1}.
                      </span>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{stat.text}</p>
                        <p className="text-xs text-gray-500">
                          {stat.timesCorrect}/{stat.timesDrawn} acertos
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-green-600">
                      {accuracy}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Most Wrong */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Mais Erradas
            </h3>
            <div className="space-y-3">
              {mostWrong.map((stat, index) => (
                <div key={stat.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 w-6">
                      {index + 1}.
                    </span>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{stat.text}</p>
                      <p className="text-xs text-gray-500">
                        {stat.type === 'WORD' ? 'Palavra' : 'Frase'}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-red-600">
                    {stat.timesWrong}x
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Worst Accuracy */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Precisa Melhorar
            </h3>
            <div className="space-y-3">
              {worstAccuracy.map((stat, index) => {
                const accuracy = stat.timesDrawn > 0 ? Math.round((stat.timesCorrect / stat.timesDrawn) * 100) : 0;
                return (
                  <div key={stat.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-500 w-6">
                        {index + 1}.
                      </span>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{stat.text}</p>
                        <p className="text-xs text-gray-500">
                          {stat.timesCorrect}/{stat.timesDrawn} acertos
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-red-600">
                      {accuracy}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

