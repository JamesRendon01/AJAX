from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import entrenadores, categorias, jugadores, asistencias, planeaciones

app = FastAPI(title="Ajax API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://localhost:5174", 
        "http://192.168.20.28:5174",
        "https://*.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(entrenadores.router)
app.include_router(categorias.router)
app.include_router(jugadores.router)
app.include_router(asistencias.router)
app.include_router(planeaciones.router)

@app.get("/")
def root():
    return {"status": "ok"}