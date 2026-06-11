from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from app.routers import entrenadores, categorias, jugadores, asistencias, planeaciones, auth

app = FastAPI(title="Ajax API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

uploads_dir = Path(__file__).resolve().parent.parent / "uploads"
uploads_dir.mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(uploads_dir)), name="uploads")

app.include_router(entrenadores.router)
app.include_router(categorias.router)
app.include_router(jugadores.router)
app.include_router(asistencias.router)
app.include_router(planeaciones.router)
app.include_router(auth.router)

@app.get("/")
def root():
    return {"status": "ok"}