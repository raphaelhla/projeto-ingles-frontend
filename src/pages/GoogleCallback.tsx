import React, { useEffect } from 'react';
// import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
// import { useAuth } from '../hooks/useAuth';
// import type { AuthResponse } from '../types';

const GoogleCallback: React.FC = () => {
  // const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  // const [message, setMessage] = useState('');
  // const [error, setError] = useState<string>('');


  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const error = searchParams.get('error');

    if (error) {
      console.error('OAuth2 error:', error);
      navigate('/login?error=oauth_failed');
      return;
    }

    if (accessToken) {
      try {
        
        
        
        // Salva todos os dados da autenticação no contexto
        // setAuthData(authResponse);
        
        // console.log('Login successful:', authResponse);
        localStorage.setItem('token', accessToken);
        // Redireciona para a página principal
        navigate('/');
      } catch (parseError) {
        console.error('Error parsing auth response:', parseError);
        navigate('/login?error=invalid_response');
      }
    } else {
      navigate('/login?error=missing_data');
    }
    }, [searchParams, navigate]);


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Processando login...</p>
      </div>
    </div>
  );
};

export default GoogleCallback;
