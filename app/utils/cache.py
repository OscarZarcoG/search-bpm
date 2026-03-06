from cachetools import TTLCache
from app.config import get_settings

settings = get_settings()

# In-memory cache for API responses
# Caches up to CACHE_MAX_SIZE items, each for CACHE_TTL_SECONDS
api_cache = TTLCache(
    maxsize=settings.CACHE_MAX_SIZE, 
    ttl=settings.CACHE_TTL_SECONDS
)

def get_cache_key(song: str, artist: str = "") -> str:
    """Generate a valid cache key based on song and artist."""
    artist_part = artist.lower().strip() if artist else ""
    song_part = song.lower().strip()
    return f"{song_part}::{artist_part}"
