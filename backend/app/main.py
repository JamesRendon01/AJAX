from fastapi import FastAPI
from app.routers import entrenadores, categorias, jugadores, asistencias, planeaciones

app = FastAPI(title="Ajax API", version="1.0.0")

app.include_router(entrenadores.router)
app.include_router(categorias.router)
app.include_router(jugadores.router)
app.include_router(asistencias.router)
app.include_router(planeaciones.router)

@app.get("/")
def root():
    return {"status": "ok"}