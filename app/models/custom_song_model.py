from sqlalchemy import Column, Integer, String
from app.database import Base

class CustomSong(Base):
    __tablename__ = "custom_songs"

    id = Column(Integer, primary_key=True, index=True)
    song = Column(String, index=True, nullable=False)
    artist = Column(String, index=True, nullable=False)
    tempo = Column(Integer, nullable=False)
    key = Column(String, nullable=True)
    time_signature = Column(Integer, nullable=True)
