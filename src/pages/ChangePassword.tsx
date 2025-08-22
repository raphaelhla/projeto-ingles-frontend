// filepath: c:\Users\raphael.h.agra\Workspace\RAPHAEL\Projeto Ingles\english-study-system\english-study-system\frontend\src\pages\ChangePassword.tsx
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { userApi } from '../services/api';
import type { ChangePasswordRequest } from '../types';

export const ChangePassword = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<ChangePasswordRequest>({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const passwordMutation = useMutation({
        mutationFn: userApi.changePassword,
        onSuccess: () => {
            setNotification({ type: 'success', text: 'Senha alterada com sucesso!' });
            setFormData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
            setTimeout(() => navigate('/'), 2000);
        },
        onError: (error: any) => {
            setNotification({ 
                type: 'error', 
                text: error?.response?.data?.message || 'Erro ao alterar senha' 
            });
        },
    });

    const updateField = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setNotification(null);
    };

    const validateAndSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.newPassword !== formData.confirmNewPassword) {
            setNotification({ type: 'error', text: 'As senhas não coincidem' });
            return;
        }

        if (formData.newPassword.length < 6) {
            setNotification({ type: 'error', text: 'A nova senha deve ter pelo menos 6 caracteres' });
            return;
        }

        passwordMutation.mutate(formData);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-start py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Alterar Senha
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Preencha os campos para alterar sua senha de acesso
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {notification && (
                        <div
                            className={`mb-4 p-4 rounded-md border ${
                                notification.type === 'success'
                                    ? 'bg-green-50 border-green-200 text-green-800'
                                    : 'bg-red-50 border-red-200 text-red-800'
                            }`}
                        >
                            <div className="flex items-center">
                                {notification.type === 'success' ? (
                                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                )}
                                <span className="text-sm font-medium">{notification.text}</span>
                            </div>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={validateAndSubmit}>
                        <div>
                            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                                Senha Atual
                            </label>
                            <div className="mt-1">
                                <input
                                    id="currentPassword"
                                    name="currentPassword"
                                    type="password"
                                    required
                                    value={formData.currentPassword}
                                    onChange={updateField}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                Nova Senha
                            </label>
                            <div className="mt-1">
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    required
                                    value={formData.newPassword}
                                    onChange={updateField}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">
                                Confirmar Nova Senha
                            </label>
                            <div className="mt-1">
                                <input
                                    id="confirmNewPassword"
                                    name="confirmNewPassword"
                                    type="password"
                                    required
                                    value={formData.confirmNewPassword}
                                    onChange={updateField}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex space-x-4">
                            <Link
                                to="/"
                                className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Cancelar
                            </Link>
                            <button
                                type="submit"
                                disabled={passwordMutation.isPending}
                                className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {passwordMutation.isPending ? 'Salvando...' : 'Alterar Senha'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};