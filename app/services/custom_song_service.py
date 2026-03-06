from sqlalchemy.orm import Session
from app.models.custom_song_model import CustomSong
from app.schemas.custom_song_schema import CustomSongCreate, CustomSongUpdate
from typing import List, Optional

class CustomSongService:
    @staticmethod
    def get_songs(db: Session, skip: int = 0, limit: int = 100) -> List[CustomSong]:
        return db.query(CustomSong).offset(skip).limit(limit).all()

    @staticmethod
    def get_song(db: Session, song_id: int) -> Optional[CustomSong]:
        return db.query(CustomSong).filter(CustomSong.id == song_id).first()

    @staticmethod
    def create_song(db: Session, song_data: CustomSongCreate) -> CustomSong:
        db_song = CustomSong(**song_data.model_dump())
        db.add(db_song)
        db.commit()
        db.refresh(db_song)
        return db_song

    @staticmethod
    def update_song(db: Session, song_id: int, song_data: CustomSongUpdate) -> Optional[CustomSong]:
        db_song = CustomSongService.get_song(db, song_id)
        if db_song:
            for key, value in song_data.model_dump().items():
                setattr(db_song, key, value)
            db.commit()
            db.refresh(db_song)
        return db_song

    @staticmethod
    def delete_song(db: Session, song_id: int) -> bool:
        db_song = CustomSongService.get_song(db, song_id)
        if db_song:
            db.delete(db_song)
            db.commit()
            return True
        return False
