from sqlalchemy import func, distinct
from sqlalchemy.orm import Session
from app.models.custom_song_model import CustomSong
from app.schemas.custom_song_schema import CustomSongCreate, CustomSongUpdate, CustomSongStatistics
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

    @staticmethod
    def get_statistics(db: Session) -> CustomSongStatistics:
        total_songs = db.query(CustomSong).count()
        total_artists = db.query(func.count(distinct(CustomSong.artist))).scalar() or 0
        avg_tempo = db.query(func.avg(CustomSong.tempo)).scalar() or 0.0

        # Slow: < 90, Medium: 90-130, Fast: > 130
        slow_cnt = db.query(CustomSong).filter(CustomSong.tempo < 90).count()
        medium_cnt = db.query(CustomSong).filter(CustomSong.tempo >= 90, CustomSong.tempo <= 130).count()
        fast_cnt = db.query(CustomSong).filter(CustomSong.tempo > 130).count()

        tempo_dist = {
            "Slow (< 90 BPM)": slow_cnt,
            "Medium (90-130 BPM)": medium_cnt,
            "Fast (> 130 BPM)": fast_cnt
        }

        keys_res = db.query(CustomSong.key, func.count(CustomSong.id)).group_by(CustomSong.key).all()
        songs_per_key = {k: v for k, v in keys_res if k is not None}

        ts_res = db.query(CustomSong.time_signature, func.count(CustomSong.id)).group_by(CustomSong.time_signature).all()
        songs_per_ts = {str(k): v for k, v in ts_res if k is not None}

        return CustomSongStatistics(
            total_songs=total_songs,
            total_artists=total_artists,
            avg_tempo=round(float(avg_tempo), 2),
            tempo_distribution=tempo_dist,
            songs_per_key=songs_per_key,
            songs_per_time_signature=songs_per_ts
        )
