import axios from 'axios';
import { CustomSong, CustomSongCreate, CustomSongUpdate } from '@/types/customSong';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getCustomSongs = async (): Promise<CustomSong[]> => {
  const response = await apiClient.get<CustomSong[]>('/api/custom-songs/');
  return response.data;
};

export const createCustomSong = async (song: CustomSongCreate): Promise<CustomSong> => {
  const response = await apiClient.post<CustomSong>('/api/custom-songs/', song);
  return response.data;
};

export const updateCustomSong = async (id: number, song: CustomSongUpdate): Promise<CustomSong> => {
  const response = await apiClient.put<CustomSong>(`/api/custom-songs/${id}`, song);
  return response.data;
};

export const deleteCustomSong = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/custom-songs/${id}`);
};
