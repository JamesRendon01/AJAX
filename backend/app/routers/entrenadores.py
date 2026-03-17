# app/routers/entrenadores.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.entrenador import Entrenador
from app.schemas.entrenador import EntrenadorCreate, EntrenadorUpdate, EntrenadorResponse
from typing import List

router = APIRouter(prefix="/entrenadores", tags=["Entrenadores"])

@router.get("/", response_model=List[EntrenadorResponse])
def listar(db: Session = Depends(get_db)):
    return db.query(Entrenador).all()

@router.get("/{id}", response_model=EntrenadorResponse)
def obtener(id: int, db: Session = Depends(get_db)):
    entrenador = db.query(Entrenador).filter(Entrenador.id == id).first()
    if not entrenador:
        raise HTTPException(status_code=404, detail="Entrenador no encontrado")
    return entrenador

@router.post("/", response_model=EntrenadorResponse, status_code=201)
def crear(data: EntrenadorCreate, db: Session = Depends(get_db)):
    entrenador = Entrenador(**data.model_dump())
    db.add(entrenador)
    db.commit()
    db.refresh(entrenador)
    return entrenador

@router.put("/{id}", response_model=EntrenadorResponse)
def actualizar(id: int, data: EntrenadorUpdate, db: Session = Depends(get_db)):
    entrenador = db.query(Entrenador).filter(Entrenador.id == id).first()
    if not entrenador:
        raise HTTPException(status_code=404, detail="Entrenador no encontrado")
    for key, value in data.model_dump(exclude_none=True).items():
        setattr(entrenador, key, value)
    db.commit()
    db.refresh(entrenador)
    return entrenador

@router.delete("/{id}", status_code=204)
def eliminar(id: int, db: Session = Depends(get_db)):
    entrenador = db.query(Entrenador).filter(Entrenador.id == id).first()
    if not entrenador:
        raise HTTPException(status_code=404, detail="Entrenador no encontrado")
    db.delete(entrenador)
    db.commit()