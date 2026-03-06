from pydantic import BaseModel, Field
from typing import Optional

class SearchQuery(BaseModel):
    song: str = Field(..., description="The name of the song to search for")
    artist: Optional[str] = Field(None, description="The artist name (optional but recommended)")

class SongBPMResponse(BaseModel):
    song: str = Field(..., description="The matched song title")
    artist: str = Field(..., description="The matched artist name")
    tempo: int = Field(..., description="The Beats Per Minute (BPM)")
    key: str = Field(..., description="The musical key of the song (e.g., 'B Minor')")
    time_signature: int = Field(..., description="The time signature of the song")

class HealthResponse(BaseModel):
    status: str = Field(default="ok", description="Status of the API")
