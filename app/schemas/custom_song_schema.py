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
