from pydantic import BaseModel, Field
from typing import Optional

class CustomSongBase(BaseModel):
    song: str = Field(..., description="Nombre de la canción")
    artist: str = Field(..., description="Nombre del artista o grupo")
    tempo: int = Field(..., description="BPM (Beats Per Minute)")
    key: Optional[str] = Field(None, description="Tonalidad musical")
    time_signature: Optional[int] = Field(None, description="Métrica (ej. 4 para 4/4)")

class CustomSongCreate(CustomSongBase):
    pass

class CustomSongUpdate(CustomSongBase):
    pass

class CustomSongResponse(CustomSongBase):
    id: int
    
    class Config:
        from_attributes = True
        # ORM mode para compatibilidad con SQLAlchemy

class CustomSongStatistics(BaseModel):
    total_songs: int
    total_artists: int
    avg_tempo: float
    tempo_distribution: dict # E.g., {"Slow": 5, "Medium": 10, "Fast": 3}
    songs_per_key: dict # E.g., {"C Major": 4, "A Minor": 2}
    songs_per_time_signature: dict # E.g., {"4": 15, "3": 2}
