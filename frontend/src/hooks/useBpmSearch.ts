import { useState } from 'react';
import { SongBPM } from '@/types/song';
import { searchSongBPM } from '@/services/bpmApi';

export function useBpmSearch() {
  const [data, setData] = useState<SongBPM | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const formatError = (message: string) => {
     // A simple fallback to catch unhandled long HTML traces if they manage to arrive
     if (message.includes('<html') || message.includes('<!DOCTYPE')) {
       return "El servidor encontró un error externo. Por favor, intenta de nuevo más tarde.";
     }
     return message;
  }

  const search = async (song: string, artist?: string) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await searchSongBPM(song, artist);
      setData(result);
      return result;
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: { detail?: string } } };
      if (err?.response?.status === 404) {
        setError(formatError(err.response?.data?.detail || 'Canción no encontrada. Prueba con otro término de búsqueda o añade el nombre del artista.'));
      } else {
        setError(formatError(err?.response?.data?.detail || 'Ha ocurrido un error inesperado del servidor.'));
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, search };
}
