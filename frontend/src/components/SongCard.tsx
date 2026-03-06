import { SongBPM } from '@/types/song';
import { Music2, Clock, Music, Activity } from 'lucide-react';
import { Metronome } from './Metronome';

interface SongCardProps {
  data: SongBPM;
}

export function SongCard({ data }: SongCardProps) {
  const getBpmCategory = (tempo: number) => {
    if (tempo < 90) return { label: 'Lento', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
    if (tempo <= 120) return { label: 'Medio', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
    return { label: 'Rápido', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' };
  };

  const category = getBpmCategory(data.tempo);

  return (
    <div className="w-full max-w-md mx-auto overflow-hidden transition-all duration-300 transform bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10">
      <div className="p-8 space-y-6">
        {/* Header Section */}
        <div className="flex items-start justify-between pb-6 border-b border-slate-800">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
              {data.song}
            </h2>
            <p className="flex items-center text-sm font-medium text-indigo-400">
              <Music2 className="w-4 h-4 mr-2" />
              {data.artist}
            </p>
          </div>
          <span className={`px-3 py-1 text-xs font-semibold border rounded-full ${category.color}`}>
            {category.label}
          </span>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center p-4 transition-colors rounded-2xl bg-slate-800/40 hover:bg-slate-800/60 font-mono">
            <Activity className="w-8 h-8 mr-3 text-rose-400" />
            <div>
              <p className="text-xs font-medium text-slate-400">BPM</p>
              <p className="text-xl font-bold text-white tracking-tight">{data.tempo}</p>
            </div>
          </div>

          <div className="flex items-center p-4 transition-colors rounded-2xl bg-slate-800/40 hover:bg-slate-800/60">
            <Music className="w-8 h-8 mr-3 text-emerald-400" />
            <div>
              <p className="text-xs font-medium text-slate-400">Tonalidad</p>
              <p className="text-lg font-bold text-white tracking-tight">{data.key}</p>
            </div>
          </div>

          <div className="col-span-2 flex items-center p-4 transition-colors rounded-2xl bg-slate-800/40 hover:bg-slate-800/60">
            <Clock className="w-8 h-8 mr-3 text-indigo-400" />
            <div>
              <p className="text-xs font-medium text-slate-400">Métrica</p>
              <p className="text-lg font-bold text-white tracking-tight">{data.time_signature}/4</p>
            </div>
          </div>
        </div>

        {/* Metronome Integration */}
        <div className="pt-4 border-t border-slate-800/50">
          <Metronome bpm={data.tempo} timeSignature={data.time_signature} label="Escuchar Tempo" />
        </div>
      </div>
    </div>
  );
}
