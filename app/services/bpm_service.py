import httpx
from typing import Optional, Dict, Any
from app.utils.cache import api_cache, get_cache_key
from app.schemas.bpm_schema import SongBPMResponse
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.custom_song_model import CustomSong
import urllib.parse
import re

def sanitize_error(text: str) -> str:
    """Ensure error messages don't leak raw HTML or excessively long messages to the frontend."""
    if not text:
        return "Unknown error"
    if "<html" in text.lower() or "<!doctype" in text.lower():
        return "The external API returned an unexpected HTML response. It might be down or blocking requests."
    return text[:200]

class BPMService:
    @staticmethod
    async def search_song(song: str, artist: Optional[str], db: Session) -> SongBPMResponse:
        """
        Search for a song BPM matching song, or song and artist, 
        using MusicBrainz to retrieve the MBID, and AcousticBrainz for the BPM.
        """
        cache_key = get_cache_key(song, artist)
        
        # Check cache
        if cache_key in api_cache:
            return api_cache[cache_key]

        # Check local DB first
        if artist:
            db_song = db.query(CustomSong).filter(CustomSong.song.ilike(f"%{song}%"), CustomSong.artist.ilike(f"%{artist}%")).first()
        else:
            db_song = db.query(CustomSong).filter(CustomSong.song.ilike(f"%{song}%")).first()
            
        if db_song:
            response_data = SongBPMResponse(
                song=db_song.song,
                artist=db_song.artist,
                tempo=db_song.tempo,
                key=db_song.key or "Unknown Key",
                time_signature=db_song.time_signature or 4
            )
            api_cache[cache_key] = response_data
            return response_data

        # Prepare MusicBrainz query
        query_parts = [f"recording:{song}"]
        if artist:
            query_parts.append(f"artist:{artist}")
        
        query_str = " AND ".join(query_parts)
        # Using urllib to ensure proper encoding of the query
        encoded_query = urllib.parse.quote(query_str)
        
        mbid_url = f"https://musicbrainz.org/ws/2/recording/?query={encoded_query}&fmt=json"

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                # User-Agent is strictly required by MusicBrainz API
                headers = {'User-Agent': 'BPM-FINDER-APP/1.0 ( placeholder@example.com )'}
                mb_response = await client.get(mbid_url, headers=headers)
                
            if mb_response.status_code != 200:
                raise HTTPException(
                    status_code=mb_response.status_code, 
                    detail=f"MusicBrainz API Error: {sanitize_error(mb_response.text)}"
                )
                
            mb_data = mb_response.json()
            recordings = mb_data.get("recordings", [])
            
            if not recordings:
                raise HTTPException(status_code=404, detail="Song not found on MusicBrainz.")

            # Grab top results to see if they have AcousticBrainz data (since not all do)
            mbids_to_try = [rec["id"] for rec in recordings[:5]]
            found_bpm_data = None
            found_artist_name = "Unknown Artist"
            found_song_name = song

            async with httpx.AsyncClient(timeout=15.0) as client:
                for mbid in mbids_to_try:
                    ab_url = f"https://acousticbrainz.org/api/v1/{mbid}/low-level"
                    ab_response = await client.get(ab_url)
                    
                    if ab_response.status_code == 200:
                        ab_data = ab_response.json()
                        # Extract the data we need
                        rhythm = ab_data.get("rhythm", {})
                        tonal = ab_data.get("tonal", {})
                        
                        bpm_raw = rhythm.get("bpm", 0)
                        
                        # Set found data
                        found_bpm_data = {
                            "tempo": int(round(float(bpm_raw))),
                            "key": f"{tonal.get('key_key', 'Unknown')} {tonal.get('key_scale', 'Unknown')}".title(),
                            "time_signature": int(rhythm.get("beats_count", 4)) # In absence of explicit time sig, we fallback or use beats count if relevant, or just default to 4
                        }
                        
                        # Find corresponding info from the MusicBrainz recording
                        for rec in recordings:
                            if rec["id"] == mbid:
                                found_song_name = rec.get("title", song)
                                artist_credits = rec.get("artist-credit", [])
                                if artist_credits and isinstance(artist_credits, list):
                                    found_artist_name = artist_credits[0].get("name", "Unknown Artist")
                                break
                        break
            
            if not found_bpm_data:
                raise HTTPException(status_code=404, detail="Song data not found in AcousticBrainz database.")

            # Construct our normal response
            response_data = SongBPMResponse(
                song=found_song_name,
                artist=found_artist_name,
                tempo=found_bpm_data["tempo"],
                key=found_bpm_data["key"].strip() if found_bpm_data["key"].strip() != "Unknown Unknown" else "Unknown Key",
                time_signature=4 # Defaults to 4 as AcousticBrainz doesn't give a direct traditional time signature fraction safely
            )

            # Store in cache
            api_cache[cache_key] = response_data
            
            return response_data

        except httpx.TimeoutException:
            raise HTTPException(status_code=504, detail="Request to external API timed out.")
        except httpx.RequestError as e:
            raise HTTPException(status_code=502, detail=f"Error connecting to external APIs: {sanitize_error(str(e))}")
