from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.custom_song_schema import CustomSongResponse, CustomSongCreate, CustomSongUpdate
from app.services.custom_song_service import CustomSongService

router = APIRouter(prefix="/api/custom-songs", tags=["Canciones Personalizadas (CRUD)"])

@router.get("/", response_model=List[CustomSongResponse])
def get_custom_songs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Añade o consulta canciones propias listadas desde la DDBB."""
    return CustomSongService.get_songs(db, skip=skip, limit=limit)

@router.post("/", response_model=CustomSongResponse, status_code=status.HTTP_201_CREATED)
def create_custom_song(song: CustomSongCreate, db: Session = Depends(get_db)):
    """Guarda en BD tus versiones modificadas de canciones con su BPM."""
    return CustomSongService.create_song(db, song)

@router.put("/{song_id}", response_model=CustomSongResponse)
def update_custom_song(song_id: int, song: CustomSongUpdate, db: Session = Depends(get_db)):
    db_song = CustomSongService.update_song(db, song_id, song)
    if not db_song:
        raise HTTPException(status_code=404, detail="Canción no encontrada")
    return db_song

@router.delete("/{song_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_custom_song(song_id: int, db: Session = Depends(get_db)):
    success = CustomSongService.delete_song(db, song_id)
    if not success:
        raise HTTPException(status_code=404, detail="Canción no encontrada")
    return None
