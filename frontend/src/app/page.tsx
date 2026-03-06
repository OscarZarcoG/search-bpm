'use client';

import { useState, useEffect } from 'react';
import { SearchForm } from '@/components/SearchForm';
import { SongCard } from '@/components/SongCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { SearchHistory, SearchItem } from '@/components/SearchHistory';
import { ConfirmModal } from '@/components/ConfirmModal';
import { useBpmSearch } from '@/hooks/useBpmSearch';
import { Music4, AlertCircle } from 'lucide-react';

export default function Home() {
  const { data, loading, error, search } = useBpmSearch();
  const [history, setHistory] = useState<SearchItem[]>([]);
  const [isConfirmHistoryOpen, setIsConfirmHistoryOpen] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('bpmSearchHistory');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse search history', e);
      }
    }
  }, []);

  const saveToHistory = (song: string, artist?: string) => {
    const newItem: SearchItem = { song, artist, timestamp: Date.now() };
    
    setHistory(prev => {
      // Remove duplicates (same song and artist)
      const filtered = prev.filter(
        item => !(item.song.toLowerCase() === song.toLowerCase() && (item.artist || '').toLowerCase() === (artist || '').toLowerCase())
      );
      
      const newHistory = [newItem, ...filtered].slice(0, 5); // Keep last 5
      localStorage.setItem('bpmSearchHistory', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const handleSearch = async (song: string, artist?: string) => {
    const result = await search(song, artist);
    if (result) {
      // Create new search history item since query was successful
      saveToHistory(song, artist);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('bpmSearchHistory');
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-16 bg-[#0a0f1c] relative overflow-hidden">
      
      {/* Background Glow Effects */}
      <div className="absolute top-0 w-full h-full max-w-4xl -translate-x-1/2 left-1/2 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[20%] w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute top-[30%] right-[10%] w-[30rem] h-[30rem] bg-rose-600/20 rounded-full blur-[100px] mix-blend-screen animate-pulse" style={{ animationDuration: '7s' }} />
      </div>

      <div className="z-10 w-full max-w-2xl mx-auto space-y-12">
        {/* Header Region */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-4 mb-4 rounded-3xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-2xl shadow-indigo-500/20">
            <Music4 className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-br from-white via-indigo-200 to-indigo-800 py-2">
            FindZarBPM
          </h1>
          <p className="max-w-md mx-auto text-base text-slate-400 md:text-lg px-4">
            Descubre al instante el tempo, la tonalidad y la métrica de tus pistas favoritas.
          </p>
        </div>

        {/* Form and Interaction Region */}
        <div className="relative">
          <SearchForm onSearch={handleSearch} isLoading={loading} />
          
          <div className="mt-12 min-h-[300px]">
             {loading && <LoadingSpinner />}
             
             {error && !loading && (
               <div className="w-full max-w-md mx-auto overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
                 <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start text-rose-300">
                    <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5 text-rose-400" />
                    <p className="text-sm font-medium leading-relaxed">{error}</p>
                 </div>
               </div>
             )}

             {data && !loading && !error && (
               <div className="animate-in fade-in zoom-in-95 duration-500">
                 <SongCard data={data} />
               </div>
             )}
          </div>
        </div>

        {/* History Component */}
        <SearchHistory 
          history={history} 
          onSelect={(song, artist) => handleSearch(song, artist)} 
          onClear={() => setIsConfirmHistoryOpen(true)} 
        />
      </div>

      <ConfirmModal 
        isOpen={isConfirmHistoryOpen}
        title="¿Borrar historial?"
        message="Esta acción eliminará todas tus búsquedas recientes de la memoria local y no se puede deshacer."
        confirmLabel="Borrar todo"
        onConfirm={() => {
          handleClearHistory();
          setIsConfirmHistoryOpen(false);
        }}
        onCancel={() => setIsConfirmHistoryOpen(false)}
      />
    </main>
  );
}
