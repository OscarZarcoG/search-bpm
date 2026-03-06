'use client';

import { useState } from 'react';
import { useCustomSongs } from '@/hooks/useCustomSongs';
import { CustomSongForm } from '@/components/CustomSongForm';
import { ConfirmModal } from '@/components/ConfirmModal';
import { Metronome } from '@/components/Metronome';
import { CustomSong, CustomSongCreate } from '@/types/customSong';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Plus, Trash2, Edit3, Activity, Music, Clock, Filter } from 'lucide-react';

export default function MisCanciones() {
  const { songs, loading, error, addSong, editSong, removeSong } = useCustomSongs();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<CustomSong | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [songToDelete, setSongToDelete] = useState<number | null>(null);
  const [filterBpm, setFilterBpm] = useState('todos');
  const [filterTimeSig, setFilterTimeSig] = useState('todos');
  const [filterKey, setFilterKey] = useState('todos');

  const handleOpenNew = () => {
    setEditingSong(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (song: CustomSong) => {
    setEditingSong(song);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: CustomSongCreate) => {
    setIsSubmitting(true);
    let success = false;
    
    if (editingSong) {
      success = await editSong(editingSong.id, data);
    } else {
      success = await addSong(data);
    }

    setIsSubmitting(false);
    if (success) setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    setSongToDelete(id);
  };

  const confirmDelete = async () => {
    if (songToDelete) {
      await removeSong(songToDelete);
      setSongToDelete(null);
    }
  };



  const getBpmCategory = (tempo: number) => {
    if (tempo < 90) return { label: 'Lento', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
    if (tempo <= 120) return { label: 'Medio', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
    return { label: 'Rápido', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' };
  };

  return (
    <main className="min-h-screen px-4 py-8 bg-[#0a0f1c] relative overflow-hidden flex flex-col items-center">
      
      {/* Glow Effects */}
      <div className="absolute top-0 w-full h-full max-w-4xl -translate-x-1/2 left-1/2 pointer-events-none opacity-20">
        <div className="absolute top-[10%] left-[10%] w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl mix-blend-screen" />
      </div>

      <div className="z-10 w-full max-w-4xl mx-auto space-y-8 mt-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Mis Canciones</h1>
            <p className="text-slate-400 text-sm mt-1">
              Guarda y administra los BPMs exactos de las versiones de tu grupo.
            </p>
          </div>
          <button 
            onClick={handleOpenNew}
            className="flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Canción
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="pt-12"><LoadingSpinner /></div>
        ) : songs.length === 0 ? (
          <div className="text-center py-24 border border-slate-800 rounded-3xl bg-slate-900/30 border-dashed">
            <Music className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-300">Sin canciones guardadas</h3>
            <p className="text-slate-500 text-sm mt-1 mb-6">Aún no has agregado ninguna canción a tu repertorio.</p>
            <button onClick={handleOpenNew} className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
              + Agregar la primera
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-4 p-4 bg-slate-900/50 border border-slate-800 rounded-2xl">
              <div className="flex items-center text-slate-400">
                 <Filter className="w-5 h-5 mr-2" />
                 <span className="text-sm font-medium">Filtros:</span>
              </div>
              <select 
                value={filterBpm}
                onChange={(e) => setFilterBpm(e.target.value)}
                className="bg-slate-800 text-sm text-slate-300 border border-slate-700 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                 <option value="todos">Todos los Ritmos</option>
                 <option value="lento">Lento (&lt;90)</option>
                 <option value="medio">Medio (90-120)</option>
                 <option value="rápido">Rápido (&gt;120)</option>
              </select>

              <select 
                value={filterTimeSig}
                onChange={(e) => setFilterTimeSig(e.target.value)}
                className="bg-slate-800 text-sm text-slate-300 border border-slate-700 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                 <option value="todos">Todas las Métricas</option>
                 {Array.from(new Set(songs.map(s => s.time_signature).filter(Boolean))).map(ts => (
                   <option key={ts} value={ts?.toString()}>{ts}/4</option>
                 ))}
              </select>

              <select 
                value={filterKey}
                onChange={(e) => setFilterKey(e.target.value)}
                className="bg-slate-800 text-sm text-slate-300 border border-slate-700 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                 <option value="todos">Todas las Tonalidades</option>
                 {Array.from(new Set(songs.map(s => s.key).filter(Boolean))).map(k => (
                   <option key={k} value={k}>{k}</option>
                 ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {songs
                 .filter(song => {
                   const cat = getBpmCategory(song.tempo).label.toLowerCase();
                   if (filterBpm !== 'todos' && cat !== filterBpm) return false;
                   if (filterTimeSig !== 'todos' && song.time_signature?.toString() !== filterTimeSig) return false;
                   if (filterKey !== 'todos' && song.key !== filterKey) return false;
                   return true;
                 })
                 .map((song) => {
                 const cat = getBpmCategory(song.tempo);
                 return (
                   <div key={song.id} className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl overflow-hidden hover:border-slate-700 transition-colors group">
                      <div className="p-5">
                         <div className="flex justify-between items-start mb-4">
                           <div>
                              <h3 className="font-bold text-lg text-white truncate max-w-[200px]" title={song.song}>{song.song}</h3>
                              <p className="text-sm text-indigo-400 truncate max-w-[200px]" title={song.artist}>{song.artist}</p>
                           </div>
                           <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md border ${cat.color}`}>
                             {cat.label}
                           </span>
                         </div>
  
                         <div className="flex items-center space-x-6">
                           <div className="flex items-center">
                             <Activity className="w-4 h-4 text-slate-500 mr-2" />
                             <span className="font-bold text-white">{song.tempo}</span>
                           </div>
                           {song.key && (
                             <div className="flex items-center">
                               <Music className="w-4 h-4 text-slate-500 mr-2" />
                               <span className="text-sm text-slate-300">{song.key}</span>
                             </div>
                           )}
                           {song.time_signature && (
                             <div className="flex items-center">
                               <Clock className="w-4 h-4 text-slate-500 mr-2" />
                               <span className="text-sm text-slate-300">{song.time_signature}/4</span>
                             </div>
                           )}
                         </div>

                         {/* Metronome Integration */}
                         <div className="mt-5 pt-4 border-t border-white/5 font-mono">
                           <Metronome bpm={song.tempo} timeSignature={song.time_signature} label="Tempo" />
                         </div>
                      </div>
                      {/* Actions */}
                      <div className="flex items-center divide-x divide-slate-800 border-t border-slate-800 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                           onClick={() => handleOpenEdit(song)}
                           className="flex-1 py-3 bg-slate-900 flex justify-center items-center text-slate-400 hover:text-white transition-colors hover:bg-slate-800"
                        >
                           <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                           onClick={() => handleDelete(song.id)}
                           className="flex-1 py-3 bg-slate-900 flex justify-center items-center text-slate-400 hover:text-rose-400 transition-colors hover:bg-slate-800"
                        >
                           <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                   </div>
                 )
              })}
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <CustomSongForm 
          initialData={editingSong || undefined}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          isLoading={isSubmitting}
        />
      )}

      <ConfirmModal 
        isOpen={!!songToDelete}
        title="¿Eliminar canción?"
        message="¿Estás seguro de que deseas eliminar esta canción de tu repertorio? Esta operación no se puede deshacer."
        confirmLabel="Eliminar"
        onConfirm={confirmDelete}
        onCancel={() => setSongToDelete(null)}
      />
    </main>
  );
}
