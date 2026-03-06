'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CustomSongCreate } from '@/types/customSong';
import { X, Save } from 'lucide-react';

const songSchema = z.object({
  song: z.string().min(1, 'El nombre es obligatorio'),
  artist: z.string().min(1, 'El artista es obligatorio'),
  tempo: z.number().min(1, 'El BPM debe ser mayor a 0'),
  key: z.string().optional(),
  time_signature: z.number().optional(),
});

type FormValues = z.infer<typeof songSchema>;

interface CustomSongFormProps {
  initialData?: FormValues;
  onSubmit: (data: CustomSongCreate) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function CustomSongForm({ initialData, onSubmit, onCancel, isLoading }: CustomSongFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(songSchema),
    defaultValues: initialData || { song: '', artist: '', tempo: 120, key: '', time_signature: 4 }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#131b2f] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden shadow-indigo-500/10">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">
            {initialData ? 'Editar Canción' : 'Agregar Canción'}
          </h2>
          <button 
            onClick={onCancel}
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block mb-1.5 text-sm font-medium text-slate-300">Canción <span className="text-rose-400">*</span></label>
            <input
              {...register('song')}
              placeholder="Nombre de la canción"
              className="w-full px-3.5 py-2.5 text-white bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-colors"
            />
            {errors.song && <p className="mt-1 text-xs text-rose-400">{errors.song.message}</p>}
          </div>

          <div>
            <label className="block mb-1.5 text-sm font-medium text-slate-300">Artista <span className="text-rose-400">*</span></label>
            <input
              {...register('artist')}
              placeholder="Nombre del artista"
              className="w-full px-3.5 py-2.5 text-white bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-colors"
            />
            {errors.artist && <p className="mt-1 text-xs text-rose-400">{errors.artist.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-sm font-medium text-slate-300">BPM <span className="text-rose-400">*</span></label>
              <input
                {...register('tempo', { valueAsNumber: true })}
                type="number"
                placeholder="120"
                className="w-full px-3.5 py-2.5 text-white bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-colors"
              />
              {errors.tempo && <p className="mt-1 text-xs text-rose-400">{errors.tempo.message}</p>}
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium text-slate-300">Métrica</label>
              <select
                {...register('time_signature', { valueAsNumber: true })}
                className="w-full px-3.5 py-2.5 text-white bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-colors appearance-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                  <option key={num} value={num} className="bg-slate-900">{num}/4</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1.5 text-sm font-medium text-slate-300">Tonalidad</label>
            <select
              {...register('key')}
              className="w-full px-3.5 py-2.5 text-white bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-colors appearance-none"
            >
              <option value="" className="bg-slate-900">Desconocida</option>
              {['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].flatMap(note => [
                <option key={`${note}-major`} value={`${note} Major`} className="bg-slate-900">{note} Major</option>,
                <option key={`${note}-minor`} value={`${note} Minor`} className="bg-slate-900">{note} Minor</option>
              ])}
            </select>
          </div>

          <div className="pt-4 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center px-6 py-2.5 text-sm font-medium text-white transition-all bg-indigo-600 rounded-xl hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
