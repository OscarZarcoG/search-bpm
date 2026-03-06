from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.bpm_routes import router as bpm_router
from app.routes.custom_song_routes import router as custom_song_router
from app.config import get_settings

# Database setup
from app.database import engine, Base
import app.models.custom_song_model # Import models so they are created
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="BPM Wrapper API",
    description="A wrapper around the GetSongBPM API to provide simplified responses for frontend applications.",
    version="1.0.0",
)

settings = get_settings()

# Enable CORS for NextJS and React Native
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(bpm_router)
app.include_router(custom_song_router)

@app.get("/", tags=["Root"])
def read_root():
    return {
        "message": "Welcome to the BPM API Wrapper!",
        "docs": "/docs",
        "health": "/api/bpm/health"
    }
