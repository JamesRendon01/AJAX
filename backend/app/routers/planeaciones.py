# app/routers/planeaciones.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.planeacion import Planeacion
from app.schemas.planeacion import PlaneacionCreate, PlaneacionUpdate, PlaneacionResponse
from typing import List

router = APIRouter(prefix="/planeaciones", tags=["Planeaciones"])

@router.get("/", response_model=List[PlaneacionResponse])
def listar(db: Session = Depends(get_db)):
    return db.query(Planeacion).all()

@router.get("/{id}", response_model=PlaneacionResponse)
def obtener(id: int, db: Session = Depends(get_db)):
    planeacion = db.query(Planeacion).filter(Planeacion.id == id).first()
    if not planeacion:
        raise HTTPException(status_code=404, detail="Planeacion no encontrada")
    return planeacion

@router.post("/", response_model=PlaneacionResponse, status_code=201)
def crear(data: PlaneacionCreate, db: Session = Depends(get_db)):
    planeacion = Planeacion(**data.model_dump())
    db.add(planeacion)
    db.commit()
    db.refresh(planeacion)
    return planeacion

@router.put("/{id}", response_model=PlaneacionResponse)
def actualizar(id: int, data: PlaneacionUpdate, db: Session = Depends(get_db)):
    planeacion = db.query(Planeacion).filter(Planeacion.id == id).first()
    if not planeacion:
        raise HTTPException(status_code=404, detail="Planeacion no encontrada")
    for key, value in data.model_dump(exclude_none=True).items():
        setattr(planeacion, key, value)
    db.commit()
    db.refresh(planeacion)
    return planeacion

@router.delete("/{id}", status_code=204)
def eliminar(id: int, db: Session = Depends(get_db)):
    planeacion = db.query(Planeacion).filter(Planeacion.id == id).first()
    if not planeacion:
        raise HTTPException(status_code=404, detail="Planeacion no encontrada")
    db.delete(planeacion)
    db.commit()