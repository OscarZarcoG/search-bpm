import { useState, useEffect, useCallback } from 'react';
import { CustomSong, CustomSongCreate, CustomSongUpdate, CustomSongStatistics } from '@/types/customSong';
import { getCustomSongs, createCustomSong, updateCustomSong, deleteCustomSong, getCustomSongStatistics } from '@/services/customBpmApi';

export function useCustomSongs() {
  const [songs, setSongs] = useState<CustomSong[]>([]);
  const [stats, setStats] = useState<CustomSongStatistics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSongs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [songsData, statsData] = await Promise.all([
        getCustomSongs(),
        getCustomSongStatistics()
      ]);
      setSongs(songsData);
      setStats(statsData);
    } catch {
      setError('Error al recuperar tus canciones.');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshStats = useCallback(async () => {
    try {
      const statsData = await getCustomSongStatistics();
      setStats(statsData);
    } catch {
      console.error("Failed to refresh stats");
    }
  }, []);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  const addSong = async (song: CustomSongCreate) => {
    try {
      const newSong = await createCustomSong(song);
      setSongs(prev => [...prev, newSong]);
      refreshStats();
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
      refreshStats();
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
      refreshStats();
      return true;
    } catch {
      setError('Error al eliminar la canción.');
      return false;
    }
  };

  return { songs, stats, loading, error, addSong, editSong, removeSong, fetchSongs };
}
