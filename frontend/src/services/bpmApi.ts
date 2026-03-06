import axios from 'axios';
import { SongBPM } from '@/types/song';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const searchSongBPM = async (song: string, artist?: string): Promise<SongBPM> => {
  const response = await apiClient.get<SongBPM>('/api/bpm/search', {
    params: {
      song,
      artist: artist || undefined,
    },
  });
  return response.data;
};
