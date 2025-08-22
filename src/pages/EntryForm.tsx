import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { entryApi } from '../services/api';
import { entrySchema, type EntryFormData } from '../utils/validation';

export const EntryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;
  const [error, setError] = useState<string>('');

  const { data: entry } = useQuery({
    queryKey: ['entry', id],
    queryFn: () => entryApi.getEntry(id!),
    enabled: isEditing,
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EntryFormData>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      type: 'WORD',
      text: '',
      translations: [{ text: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'translations',
  });

  useEffect(() => {
    if (entry) {
      reset({
        type: entry.type,
        text: entry.text,
        translations: entry.translations.map(t => ({ text: t.text })),
      });
    }
  }, [entry, reset]);

  const createMutation = useMutation({
    mutationFn: entryApi.createEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      navigate('/entries');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Erro ao criar entrada');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => entryApi.updateEntry(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      queryClient.invalidateQueries({ queryKey: ['entry', id] });
      navigate('/entries');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Erro ao atualizar entrada');
    },
  });

  const onSubmit = async (data: EntryFormData) => {
    try {
      setError('');
      if (isEditing) {
        await updateMutation.mutateAsync({ id: id!, data });
      } else {
        await createMutation.mutateAsync(data);
      }
    } catch (err) {
      // Error handled in mutation
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {isEditing ? 'Editar Entrada' : 'Nova Entrada'}
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              {isEditing 
                ? 'Atualize as informações da palavra ou frase.'
                : 'Adicione uma nova palavra ou frase para estudar.'
              }
            </p>
          </div>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tipo
                  </label>
                  <select
                    {...register('type')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="WORD">Palavra</option>
                    <option value="PHRASE">Frase</option>
                  </select>
                  {errors.type && (
                    <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Texto em Inglês
                  </label>
                  <input
                    type="text"
                    {...register('text')}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="Digite a palavra ou frase em inglês"
                  />
                  {errors.text && (
                    <p className="mt-1 text-sm text-red-600">{errors.text.message}</p>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-gray-700">
                      Traduções
                    </label>
                    <button
                      type="button"
                      onClick={() => append({ text: '' })}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                    >
                      Adicionar Tradução
                    </button>
                  </div>
                  <div className="mt-2 space-y-2">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex items-center space-x-2">
                        <input
                          type="text"
                          {...register(`translations.${index}.text`)}
                          className="flex-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          placeholder="Digite a tradução em português"
                        />
                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                          >
                            Remover
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {errors.translations && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.translations.message || 'Verifique as traduções'}
                    </p>
                  )}
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 space-x-3">
                <button
                  type="button"
                  onClick={() => navigate('/entries')}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSubmitting 
                    ? (isEditing ? 'Atualizando...' : 'Criando...') 
                    : (isEditing ? 'Atualizar' : 'Criar')
                  }
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

