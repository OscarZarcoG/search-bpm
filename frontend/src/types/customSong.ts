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

export interface CustomSongUpdate extends CustomSongCreate {}
