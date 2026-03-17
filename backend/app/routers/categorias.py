# app/routers/categorias.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.categoria import Categoria
from app.schemas.categoria import CategoriaCreate, CategoriaUpdate, CategoriaResponse
from typing import List

router = APIRouter(prefix="/categorias", tags=["Categorias"])

@router.get("/", response_model=List[CategoriaResponse])
def listar(db: Session = Depends(get_db)):
    return db.query(Categoria).all()

@router.get("/{id}", response_model=CategoriaResponse)
def obtener(id: int, db: Session = Depends(get_db)):
    categoria = db.query(Categoria).filter(Categoria.id == id).first()
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoria no encontrada")
    return categoria

@router.post("/", response_model=CategoriaResponse, status_code=201)
def crear(data: CategoriaCreate, db: Session = Depends(get_db)):
    categoria = Categoria(**data.model_dump())
    db.add(categoria)
    db.commit()
    db.refresh(categoria)
    return categoria

@router.put("/{id}", response_model=CategoriaResponse)
def actualizar(id: int, data: CategoriaUpdate, db: Session = Depends(get_db)):
    categoria = db.query(Categoria).filter(Categoria.id == id).first()
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoria no encontrada")
    for key, value in data.model_dump(exclude_none=True).items():
        setattr(categoria, key, value)
    db.commit()
    db.refresh(categoria)
    return categoria

@router.delete("/{id}", status_code=204)
def eliminar(id: int, db: Session = Depends(get_db)):
    categoria = db.query(Categoria).filter(Categoria.id == id).first()
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoria no encontrada")
    db.delete(categoria)
    db.commit()