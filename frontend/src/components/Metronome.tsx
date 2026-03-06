'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Square, Volume2, VolumeX } from 'lucide-react';

// Singleton para el AudioContext para evitar el límite de contextos en el navegador (especialmente en listas)
let globalAudioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  if (!globalAudioContext) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    globalAudioContext = new AudioContextClass();
  }
  return globalAudioContext;
};

interface MetronomeProps {
  bpm: number;
  label?: string;
}

export function Metronome({ bpm, label = "Metrónomo" }: MetronomeProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [beat, setBeat] = useState(0);
  
  // Usamos Refs para que el scheduler siempre tenga los valores más recientes sin recrear funciones
  const bpmRef = useRef(bpm);
  const isMutedRef = useRef(isMuted);
  const isPlayingRef = useRef(false);
  const nextClickTimeRef = useRef(0);
  const currentBeatRef = useRef(0);
  const timerIDRef = useRef<number | null>(null);

  // Actualizar refs cuando cambian los props/estado
  useEffect(() => { bpmRef.current = bpm; }, [bpm]);
  useEffect(() => { isMutedRef.current = isMuted; }, [isMuted]);

  const playClick = useCallback((time: number, isFirstBeat: boolean) => {
    const ctx = getAudioContext();
    if (!ctx || isMutedRef.current) return;

    const osc = ctx.createOscillator();
    const envelope = ctx.createGain();

    osc.frequency.value = isFirstBeat ? 1000 : 800;
    
    envelope.gain.value = 1;
    envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

    osc.connect(envelope);
    envelope.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.1);
  }, []);

  const scheduler = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx || !isPlayingRef.current) return;

    // Programar sonidos adelantados (lookahead)
    while (nextClickTimeRef.current < ctx.currentTime + 0.1) {
      const isFirstBeat = currentBeatRef.current === 0;
      playClick(nextClickTimeRef.current, isFirstBeat);
      
      // Actualizar visualización (esto ocurre en el hilo de UI)
      const currentBeatValue = currentBeatRef.current;
      setTimeout(() => setBeat(currentBeatValue), 0);
      
      // Avanzar el tiempo
      const secondsPerBeat = 60.0 / Math.max(bpmRef.current, 1);
      nextClickTimeRef.current += secondsPerBeat;
      currentBeatRef.current = (currentBeatRef.current + 1) % 4;
    }
    
    timerIDRef.current = window.requestAnimationFrame(scheduler);
  }, [playClick]);

  const toggleMetronome = () => {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (isPlaying) {
      isPlayingRef.current = false;
      if (timerIDRef.current) cancelAnimationFrame(timerIDRef.current);
      setIsPlaying(false);
      setBeat(0);
      currentBeatRef.current = 0;
    } else {
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      
      // Reiniciar punteros
      isPlayingRef.current = true;
      currentBeatRef.current = 0;
      nextClickTimeRef.current = ctx.currentTime + 0.05;
      setIsPlaying(true);
      scheduler();
    }
  };

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      isPlayingRef.current = false;
      if (timerIDRef.current) cancelAnimationFrame(timerIDRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center p-3 rounded-2xl bg-white/5 border border-white/10 transition-all hover:bg-white/10">
      <div className="flex items-center justify-between w-full mb-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label} (BPM: {bpm})</span>
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="text-slate-500 hover:text-indigo-400 transition-colors"
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={toggleMetronome}
          className={`relative group flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
            isPlaying 
              ? 'bg-rose-500 shadow-lg shadow-rose-500/40 text-white' 
              : 'bg-indigo-600 shadow-lg shadow-indigo-600/40 text-white hover:scale-105'
          }`}
        >
          {isPlaying ? <Square className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
          
          {/* Visual Feedback Ring */}
          {isPlaying && (
            <div className="absolute inset-0 rounded-full border-2 border-white animate-ping opacity-25" style={{ animationDuration: `${60/bpm}s` }} />
          )}
        </button>

        <div className="flex space-x-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div 
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-150 ${
                isPlaying && beat === i 
                  ? (i === 0 ? 'bg-indigo-400 scale-150 shadow-lg shadow-indigo-400/50' : 'bg-indigo-400/60 scale-125') 
                  : 'bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
