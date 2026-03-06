'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Search } from 'lucide-react';

const searchSchema = z.object({
  song: z.string().min(1, 'El nombre de la canción es obligatorio'),
  artist: z.string().optional(),
});

type SearchFormValues = z.infer<typeof searchSchema>;

interface SearchFormProps {
  onSearch: (song: string, artist?: string) => void;
  isLoading: boolean;
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: { song: '', artist: '' }
  });

  const onSubmit = (data: SearchFormValues) => {
    onSearch(data.song, data.artist);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md mx-auto space-y-4">
      <div className="space-y-4">
        <div>
          <label htmlFor="song" className="block mb-2 text-sm font-medium text-slate-300">
            Canción <span className="text-rose-400">*</span>
          </label>
          <input
            {...register('song')}
            id="song"
            type="text"
            placeholder="ej. Believer"
            className="w-full px-4 py-3 text-white transition-colors bg-slate-900/50 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-500"
            disabled={isLoading}
          />
          {errors.song && <p className="mt-2 text-sm text-rose-400">{errors.song.message}</p>}
        </div>

        <div>
          <label htmlFor="artist" className="block mb-2 text-sm font-medium text-slate-300">
            Artista <span className="text-slate-500">(Opcional)</span>
          </label>
          <input
            {...register('artist')}
            id="artist"
            type="text"
            placeholder="ej. Imagine Dragons"
            className="w-full px-4 py-3 text-white transition-colors bg-slate-900/50 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-500"
            disabled={isLoading}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="flex items-center justify-center w-full px-8 py-3.5 text-sm font-medium text-white transition-all transform bg-indigo-600 rounded-xl hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0 shadow-xl shadow-indigo-600/20"
      >
        <Search className="w-5 h-5 mr-2" />
        {isLoading ? 'Buscando...' : 'Buscar BPM'}
      </button>
    </form>
  );
}
