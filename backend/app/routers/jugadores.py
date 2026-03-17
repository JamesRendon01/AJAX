# app/routers/jugadores.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.jugador import Jugador
from app.schemas.jugador import JugadorCreate, JugadorUpdate, JugadorResponse
from typing import List

router = APIRouter(prefix="/jugadores", tags=["Jugadores"])

@router.get("/", response_model=List[JugadorResponse])
def listar(db: Session = Depends(get_db)):
    return db.query(Jugador).all()

@router.get("/{id}", response_model=JugadorResponse)
def obtener(id: int, db: Session = Depends(get_db)):
    jugador = db.query(Jugador).filter(Jugador.id == id).first()
    if not jugador:
        raise HTTPException(status_code=404, detail="Jugador no encontrado")
    return jugador

@router.post("/", response_model=JugadorResponse, status_code=201)
def crear(data: JugadorCreate, db: Session = Depends(get_db)):
    jugador = Jugador(**data.model_dump())
    db.add(jugador)
    db.commit()
    db.refresh(jugador)
    return jugador

@router.put("/{id}", response_model=JugadorResponse)
def actualizar(id: int, data: JugadorUpdate, db: Session = Depends(get_db)):
    jugador = db.query(Jugador).filter(Jugador.id == id).first()
    if not jugador:
        raise HTTPException(status_code=404, detail="Jugador no encontrado")
    for key, value in data.model_dump(exclude_none=True).items():
        setattr(jugador, key, value)
    db.commit()
    db.refresh(jugador)
    return jugador

@router.delete("/{id}", status_code=204)
def eliminar(id: int, db: Session = Depends(get_db)):
    jugador = db.query(Jugador).filter(Jugador.id == id).first()
    if not jugador:
        raise HTTPException(status_code=404, detail="Jugador no encontrado")
    db.delete(jugador)
    db.commit()