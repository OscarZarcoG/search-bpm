export interface CustomSong {
  id: number;
  song: string;
  artist: string;
  tempo: number;
  key?: string;
  time_signature?: number;
}

export interface CustomSongCreate {
  song: string;
  artist: string;
  tempo: number;
  key?: string;
  time_signature?: number;
}

export type CustomSongUpdate = CustomSongCreate;

export interface CustomSongStatistics {
  total_songs: number;
  total_artists: number;
  avg_tempo: number;
  tempo_distribution: Record<string, number>;
  songs_per_key: Record<string, number>;
  songs_per_time_signature: Record<string, number>;
}
