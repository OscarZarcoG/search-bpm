'use client';

import { History } from 'lucide-react';

export interface SearchItem {
  song: string;
  artist?: string;
  timestamp: number;
}

interface SearchHistoryProps {
  history: SearchItem[];
  onSelect: (song: string, artist?: string) => void;
  onClear: () => void;
}

export function SearchHistory({ history, onSelect, onClear }: SearchHistoryProps) {
  if (history.length === 0) return null;

  return (
    <div className="w-full max-w-md mx-auto mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-4 text-slate-400">
        <h3 className="flex items-center text-xs font-semibold uppercase tracking-wider">
          <History className="w-4 h-4 mr-2" />
          Búsquedas Recientes
        </h3>
        <button 
          onClick={onClear} 
          className="text-xs hover:text-rose-400 transition-colors font-medium border-b border-transparent hover:border-rose-400"
        >
          Borrar Historial
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {history.map((item) => (
          <button
            key={item.timestamp}
            onClick={() => onSelect(item.song, item.artist)}
            className="flex items-center px-4 py-2 text-sm transition-all border border-slate-800 rounded-xl text-slate-300 bg-slate-900/40 hover:bg-indigo-500/10 hover:border-indigo-500/30 hover:text-white"
          >
            <span className="font-semibold">{item.song}</span>
            {item.artist && (
              <span className="ml-1 text-slate-500 opacity-75 truncate max-w-[120px]">
                <span className="mx-1.5 text-slate-700">•</span>
                {item.artist}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
