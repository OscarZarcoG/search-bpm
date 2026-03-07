import React from 'react';
import { CustomSongStatistics } from '@/types/customSong';
import { Music, Users, Activity, BarChart3, Clock, Layers } from 'lucide-react';

interface StatsOverviewProps {
  stats: CustomSongStatistics | null;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  if (!stats) return null;

  const cards = [
    {
      label: 'Total Canciones',
      value: stats.total_songs,
      icon: Music,
      color: 'from-blue-500/20 to-indigo-500/20',
      iconColor: 'text-blue-400',
    },
    {
      label: 'Artistas Únicos',
      value: stats.total_artists,
      icon: Users,
      color: 'from-purple-500/20 to-pink-500/20',
      iconColor: 'text-purple-400',
    },
    {
      label: 'BPM Promedio',
      value: stats.avg_tempo,
      icon: Activity,
      color: 'from-emerald-500/20 to-teal-500/20',
      iconColor: 'text-emerald-400',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`relative overflow-hidden bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl p-6 hover:border-slate-700 transition-all group`}
          >
            <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${card.color} rounded-full blur-2xl opacity-50 group-hover:opacity-80 transition-opacity`} />
            
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-slate-400 text-sm font-medium">{card.label}</p>
                <p className="text-3xl font-bold text-white mt-1">{card.value}</p>
              </div>
              <div className={`p-3 rounded-2xl bg-slate-800/50 ${card.iconColor}`}>
                <card.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tempo Distribution */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center space-x-2 mb-6">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            <h3 className="text-white font-semibold">Distribución de Ritmos</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(stats.tempo_distribution).map(([label, count]) => {
              const percentage = stats.total_songs > 0 ? (count / stats.total_songs) * 100 : 0;
              let barColor = 'bg-blue-500';
              if (label.includes('Medium')) barColor = 'bg-emerald-500';
              if (label.includes('Fast')) barColor = 'bg-rose-500';

              return (
                <div key={label} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-400">{label}</span>
                    <span className="text-white">{count} ({Math.round(percentage)}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${barColor} transition-all duration-1000 ease-out`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Breakdown by Key & Time Signature */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Layers className="w-5 h-5 text-pink-400" />
            <h3 className="text-white font-semibold">Métricas y Tonalidades</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
               <div className="flex items-center text-xs text-slate-500 mb-2 uppercase tracking-wider font-bold">
                 <Clock className="w-3 h-3 mr-1" /> Métricas
               </div>
               <div className="flex flex-wrap gap-2">
                 {Object.entries(stats.songs_per_time_signature).length > 0 ? (
                   Object.entries(stats.songs_per_time_signature).map(([ts, count]) => (
                     <div key={ts} className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs">
                        <span className="text-white font-bold">{ts}/4</span>
                        <span className="text-slate-500 ml-1.5">({count})</span>
                     </div>
                   ))
                 ) : (
                   <span className="text-slate-600 text-xs italic">Sin datos</span>
                 )}
               </div>
            </div>
            <div className="space-y-4">
               <div className="flex items-center text-xs text-slate-500 mb-2 uppercase tracking-wider font-bold">
                 <Music className="w-3 h-3 mr-1" /> Tonalidades
               </div>
               <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
                 {Object.entries(stats.songs_per_key).length > 0 ? (
                   Object.entries(stats.songs_per_key).map(([key, count]) => (
                     <div key={key} className="px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs">
                        <span className="text-indigo-400 font-bold">{key}</span>
                        <span className="text-slate-500 ml-1.5">({count})</span>
                     </div>
                   ))
                 ) : (
                   <span className="text-slate-600 text-xs italic">Sin datos</span>
                 )}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
