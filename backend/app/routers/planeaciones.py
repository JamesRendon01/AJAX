from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.planeacion import Planeacion
from app.services.storage import subir_archivo, limpiar
from typing import Optional
import uuid

router = APIRouter(prefix="/planeaciones", tags=["Planeaciones"])

@router.get("/")
def listar(db: Session = Depends(get_db)):
    return db.query(Planeacion).all()

@router.get("/{id}")
def obtener(id: int, db: Session = Depends(get_db)):
    obj = db.query(Planeacion).filter(Planeacion.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="No encontrado")
    return obj

@router.post("/", status_code=201)
async def crear(
    nombre: str = Form(...),
    fechaInicio: Optional[str] = Form(None),
    fechaFin: Optional[str] = Form(None),
    fechaCarga: Optional[str] = Form(None),
    idCategoria: Optional[int] = Form(None),
    archivo: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    datos = {
        "nombre": nombre,
        "fechaInicio": limpiar(fechaInicio),
        "fechaFin": limpiar(fechaFin),
        "fechaCarga": limpiar(fechaCarga),
        "idCategoria": idCategoria
    }

    if archivo:
        nombre_archivo = f"{uuid.uuid4()}_{archivo.filename}"
        datos["archivo"] = subir_archivo(
            await archivo.read(), nombre_archivo, "planeaciones"
        )

    obj = Planeacion(**datos)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

@router.put("/{id}")
async def actualizar(
    id: int,
    nombre: Optional[str] = Form(None),
    fechaInicio: Optional[str] = Form(None),
    fechaFin: Optional[str] = Form(None),
    fechaCarga: Optional[str] = Form(None),
    idCategoria: Optional[int] = Form(None),
    archivo: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    obj = db.query(Planeacion).filter(Planeacion.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="No encontrado")

    if nombre: obj.nombre = nombre
    if fechaInicio: obj.fechaInicio = limpiar(fechaInicio)
    if fechaFin: obj.fechaFin = limpiar(fechaFin)
    if fechaCarga: obj.fechaCarga = limpiar(fechaCarga)
    if idCategoria: obj.idCategoria = idCategoria

    if archivo:
        nombre_archivo = f"{uuid.uuid4()}_{archivo.filename}"
        obj.archivo = subir_archivo(
            await archivo.read(), nombre_archivo, "planeaciones"
        )

    db.commit()
    db.refresh(obj)
    return obj

@router.delete("/{id}", status_code=204)
def eliminar(id: int, db: Session = Depends(get_db)):
    obj = db.query(Planeacion).filter(Planeacion.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="No encontrado")
    db.delete(obj)
    db.commit()