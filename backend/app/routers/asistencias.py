from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.asistencia import Asistencia

router = APIRouter(prefix="/asistencias", tags=["Asistencias"])

@router.get("/")
def listar(db: Session = Depends(get_db)):
    return db.query(Asistencia).all()

@router.get("/{id}")
def obtener(id: int, db: Session = Depends(get_db)):
    obj = db.query(Asistencia).filter(Asistencia.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="No encontrado")
    return obj

@router.post("/", status_code=201)
def crear(data: dict, db: Session = Depends(get_db)):
    obj = Asistencia(**data)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

@router.put("/{id}")
def actualizar(id: int, data: dict, db: Session = Depends(get_db)):
    obj = db.query(Asistencia).filter(Asistencia.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="No encontrado")
    for k, v in data.items():
        setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return obj

@router.delete("/{id}", status_code=204)
def eliminar(id: int, db: Session = Depends(get_db)):
    obj = db.query(Asistencia).filter(Asistencia.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="No encontrado")
    db.delete(obj)
    db.commit() 