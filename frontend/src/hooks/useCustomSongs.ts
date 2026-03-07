import { useState, useEffect, useCallback } from 'react';
import { CustomSong, CustomSongCreate, CustomSongUpdate } from '@/types/customSong';
import { getCustomSongs, createCustomSong, updateCustomSong, deleteCustomSong } from '@/services/customBpmApi';

export function useCustomSongs() {
  const [songs, setSongs] = useState<CustomSong[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSongs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const songsData = await getCustomSongs();
      setSongs(songsData);
    } catch {
      setError('Error al recuperar tus canciones.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  const addSong = async (song: CustomSongCreate) => {
    try {
      const newSong = await createCustomSong(song);
      setSongs(prev => [...prev, newSong]);
      return true;
    } catch {
      setError('Error al crear la canción.');
      return false;
    }
  };

  const editSong = async (id: number, song: CustomSongUpdate) => {
    try {
      const updated = await updateCustomSong(id, song);
      setSongs(prev => prev.map(s => (s.id === id ? updated : s)));
      return true;
    } catch {
      setError('Error al actualizar la canción.');
      return false;
    }
  };

  const removeSong = async (id: number) => {
    try {
      await deleteCustomSong(id);
      setSongs(prev => prev.filter(s => s.id !== id));
      return true;
    } catch {
      setError('Error al eliminar la canción.');
      return false;
    }
  };

  return { songs, loading, error, addSong, editSong, removeSong, fetchSongs };
}
