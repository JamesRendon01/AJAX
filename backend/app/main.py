import os
import time
from collections import defaultdict
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from pathlib import Path
from app.routers import entrenadores, categorias, jugadores, asistencias, planeaciones, auth
from app.database import get_db

app = FastAPI(title="Ajax API", version="1.0.0")

_rate_limit_requests: dict = defaultdict(list)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://192.168.20.28:5174",
        "https://ajax-liart.vercel.app",
        "https://ajax-james-rendons-projects.vercel.app",
        "https://ajax-peay.onrender.com",
    ],
    allow_origin_regex=r"https://.*\.onrender\.com",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    return response


@app.middleware("http")
async def rate_limit(request: Request, call_next):
    if request.url.path in ("/health", "/"):
        return await call_next(request)

    client_ip = request.client.host if request.client else "unknown"
    now = time.time()
    window_start = now - 60
    global _rate_limit_requests
    _rate_limit_requests[client_ip] = [t for t in _rate_limit_requests[client_ip] if t > window_start]

    if len(_rate_limit_requests[client_ip]) >= 60:
        return JSONResponse(
            status_code=429,
            content={"detail": "Demasiadas solicitudes. Intenta de nuevo en un minuto."}
        )

    _rate_limit_requests[client_ip].append(now)
    return await call_next(request)


if not os.getenv("CLOUDINARY_CLOUD_NAME"):
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

@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    try:
        from sqlalchemy import text
        db.execute(text("SELECT 1"))
        return {"status": "ok", "database": "connected"}
    except Exception:
        return {"status": "error", "database": "disconnected"}