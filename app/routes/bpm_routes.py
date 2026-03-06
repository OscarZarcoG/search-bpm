from fastapi import APIRouter, Query, Depends
from typing import Optional
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.bpm_schema import SongBPMResponse, HealthResponse
from app.services.bpm_service import BPMService

router = APIRouter(prefix="/api/bpm", tags=["BPM Search"])

@router.get("/search", response_model=SongBPMResponse)
async def search_bpm(
    song: str = Query(..., description="The name of the song to search for"),
    artist: Optional[str] = Query(None, description="The artist name"),
    db: Session = Depends(get_db)
) -> SongBPMResponse:
    """
    Search for a song's BPM and musical structure details by title and optionally artist.
    Results are cached in-memory for 24 hours.
    """
    return await BPMService.search_song(song, artist, db)

@router.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """
    Health check endpoint for monitoring purposes.
    """
    return HealthResponse(status="ok")
