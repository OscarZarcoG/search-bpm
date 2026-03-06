import { useState, useEffect, useRef, useCallback, useId } from 'react';
import { Play, Square, Volume2, VolumeX } from 'lucide-react';

// Singleton para el AudioContext para evitar el límite de contextos en el navegador
let globalAudioContext: AudioContext | null = null;
const STOP_EVENT = 'stop-all-metronomes';

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
  timeSignature?: number;
  label?: string;
}

export function Metronome({ bpm, timeSignature = 4, label = "Metrónomo" }: MetronomeProps) {
  const instanceId = useId();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [beat, setBeat] = useState(0);

  const bpmRef = useRef(bpm);
  const timeSigRef = useRef(timeSignature);
  const isMutedRef = useRef(isMuted);
  const isPlayingRef = useRef(false);
  const nextClickTimeRef = useRef(0);
  const currentBeatRef = useRef(0);
  const timerIDRef = useRef<number | null>(null);

  // Sincronizar refs
  useEffect(() => { bpmRef.current = bpm; }, [bpm]);
  useEffect(() => { timeSigRef.current = timeSignature; }, [timeSignature]);
  useEffect(() => { isMutedRef.current = isMuted; }, [isMuted]);

  const stopMetronome = useCallback(() => {
    if (isPlayingRef.current) {
      isPlayingRef.current = false;
      if (timerIDRef.current) cancelAnimationFrame(timerIDRef.current);
      setIsPlaying(false);
      setBeat(0);
      currentBeatRef.current = 0;
    }
  }, []);

  // Escuchar evento global para detenerse si otro metrónomo inicia
  useEffect(() => {
    const handleGlobalStop = (e: Event) => {
      const customEvent = e as CustomEvent<{ id: string }>;
      if (customEvent.detail?.id !== instanceId) {
        stopMetronome();
      }
    };
    window.addEventListener(STOP_EVENT, handleGlobalStop);
    return () => window.removeEventListener(STOP_EVENT, handleGlobalStop);
  }, [instanceId, stopMetronome]);

  const playClick = useCallback((time: number, isFirstBeat: boolean) => {
    const ctx = getAudioContext();
    if (!ctx || isMutedRef.current) return;

    const osc = ctx.createOscillator();
    const envelope = ctx.createGain();

    // Mayor frecuencia para el acento y volumen potente (1800Hz para acento)
    osc.frequency.setValueAtTime(isFirstBeat ? 1600 : 800, time);
    
    // Volumen potente: Iniciamos en 4.0 para que se oiga bien en móvil
    envelope.gain.setValueAtTime(0, time);
    envelope.gain.linearRampToValueAtTime(3.0, time + 0.002); 
    envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

    osc.connect(envelope);
    envelope.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.12);
  }, []);

  const scheduler = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx || !isPlayingRef.current) return;

    while (nextClickTimeRef.current < ctx.currentTime + 0.1) {
      const beatsInCycle = timeSigRef.current || 4;
      const isFirstBeat = currentBeatRef.current === 0;
      playClick(nextClickTimeRef.current, isFirstBeat);

      const currentBeatValue = currentBeatRef.current;
      setTimeout(() => setBeat(currentBeatValue), 0);

      const secondsPerBeat = 60.0 / Math.max(bpmRef.current, 1);
      nextClickTimeRef.current += secondsPerBeat;
      currentBeatRef.current = (currentBeatRef.current + 1) % beatsInCycle;
    }

    timerIDRef.current = window.requestAnimationFrame(scheduler);
  }, [playClick]);

  const toggleMetronome = () => {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (isPlaying) {
      stopMetronome();
    } else {
      // Notificar a otros metrónomos que deben callarse
      window.dispatchEvent(new CustomEvent(STOP_EVENT, { detail: { id: instanceId } }));

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      isPlayingRef.current = true;
      currentBeatRef.current = 0;
      nextClickTimeRef.current = ctx.currentTime + 0.05;
      setIsPlaying(true);
      scheduler();
    }
  };

  useEffect(() => {
    return () => {
      isPlayingRef.current = false;
      if (timerIDRef.current) cancelAnimationFrame(timerIDRef.current);
    };
  }, []);

  const dotsCount = timeSignature || 4;

  return (
    <div className="flex flex-col items-center p-3 rounded-2xl bg-white/5 border border-white/10 transition-all hover:bg-white/10">
      <div className="flex items-center justify-between w-full mb-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          {label} ({timeSignature}/4 @ {bpm})
        </span>
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
          className={`relative group flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${isPlaying
              ? 'bg-rose-500 shadow-lg shadow-rose-500/40 text-white'
              : 'bg-indigo-600 shadow-lg shadow-indigo-600/40 text-white hover:scale-105'
            }`}
        >
          {isPlaying ? <Square className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}

          {isPlaying && (
            <div className="absolute inset-0 rounded-full border-2 border-white animate-ping opacity-25" style={{ animationDuration: `${60 / bpm}s` }} />
          )}
        </button>

        <div className="flex space-x-1.5 flex-wrap justify-center max-w-[100px]">
          {Array.from({ length: dotsCount }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-150 ${isPlaying && beat === i
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
