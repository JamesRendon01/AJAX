from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.asistencia import Asistencia
from app.services.storage import subir_archivo, limpiar
from typing import Optional
import uuid

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
async def crear(
    nombre: str = Form(...),
    fechaCreacion: Optional[str] = Form(None),
    fechaCargado: Optional[str] = Form(None),
    idEntrenador: Optional[int] = Form(None),
    idCategoria: Optional[int] = Form(None),
    archivo: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    datos = {
        "nombre": nombre,
        "fechaCreacion": limpiar(fechaCreacion),
        "fechaCargado": limpiar(fechaCargado),
        "idEntrenador": idEntrenador,
        "idCategoria": idCategoria
    }

    if archivo:
        nombre_archivo = f"{uuid.uuid4()}_{archivo.filename}"
        datos["archivo"] = subir_archivo(
            await archivo.read(), nombre_archivo, "asistencias"
        )

    obj = Asistencia(**datos)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

@router.put("/{id}")
async def actualizar(
    id: int,
    nombre: Optional[str] = Form(None),
    fechaCreacion: Optional[str] = Form(None),
    fechaCargado: Optional[str] = Form(None),
    idEntrenador: Optional[int] = Form(None),
    idCategoria: Optional[int] = Form(None),
    archivo: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    obj = db.query(Asistencia).filter(Asistencia.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="No encontrado")

    if nombre: obj.nombre = nombre
    if fechaCreacion: obj.fechaCreacion = limpiar(fechaCreacion)
    if fechaCargado: obj.fechaCargado = limpiar(fechaCargado)
    if idEntrenador: obj.idEntrenador = idEntrenador
    if idCategoria: obj.idCategoria = idCategoria

    if archivo:
        nombre_archivo = f"{uuid.uuid4()}_{archivo.filename}"
        obj.archivo = subir_archivo(
            await archivo.read(), nombre_archivo, "asistencias"
        )

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