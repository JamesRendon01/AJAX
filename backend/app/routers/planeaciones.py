from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.planeacion import Planeacion
from app.models.entrenador import Entrenador
from app.services.storage import subir_archivo, limpiar
from app.dependencies import get_current_user, require_rol
from typing import Optional
from datetime import date, datetime
import uuid

router = APIRouter(prefix="/planeaciones", tags=["Planeaciones"])

ROLES_ADMIN_COORD = ("admin", "coordinador")

@router.get("/")
def listar(
    db: Session = Depends(get_db),
    user: Entrenador = Depends(get_current_user)
):
    if user.rol in ROLES_ADMIN_COORD:
        return db.query(Planeacion).all()
    else:
        from app.models.categoria import Categoria
        cat_ids = db.query(Categoria.id).filter(Categoria.idEntrenador == user.id).subquery()
        return db.query(Planeacion).filter(Planeacion.idCategoria.in_(cat_ids)).all()

@router.get("/{id}")
def obtener(
    id: int,
    db: Session = Depends(get_db),
    user: Entrenador = Depends(get_current_user)
):
    obj = db.query(Planeacion).filter(Planeacion.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="No encontrado")

    if user.rol not in ROLES_ADMIN_COORD:
        from app.models.categoria import Categoria
        cat = db.query(Categoria).filter(Categoria.id == obj.idCategoria).first()
        if not cat or cat.idEntrenador != user.id:
            raise HTTPException(status_code=403, detail="No tienes permisos")

    return obj

@router.post("/", status_code=201)
async def crear(
    nombre: str = Form(...),
    fechaInicio: Optional[str] = Form(None),
    fechaFin: Optional[str] = Form(None),
    fechaCarga: Optional[str] = Form(None),
    idCategoria: Optional[int] = Form(None),
    archivo: Optional[UploadFile] = File(None),
    lapsoInicio: Optional[str] = Form(None),
    lapsoFin: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    user: Entrenador = Depends(get_current_user)
):
    if user.rol == "entrenador":
        hoy = date.today()
        from app.models.categoria import Categoria
        cat = db.query(Categoria).filter(Categoria.id == idCategoria, Categoria.idEntrenador == user.id).first()
        if not cat:
            raise HTTPException(status_code=403, detail="No tienes permisos para esta categoria")

        existing = db.query(Planeacion).filter(
            Planeacion.idCategoria == idCategoria
        ).first()
        if existing:
            if not existing.lapsoInicio or not existing.lapsoFin:
                raise HTTPException(status_code=403, detail="No hay un lapso de tiempo definido para subir planeaciones")
            if hoy < existing.lapsoInicio or hoy > existing.lapsoFin:
                raise HTTPException(status_code=403, detail="Fuera del lapso de tiempo permitido para subir planeaciones")

    datos = {
        "nombre": nombre,
        "fechaInicio": limpiar(fechaInicio),
        "fechaFin": limpiar(fechaFin),
        "fechaCarga": limpiar(fechaCarga),
        "idCategoria": idCategoria,
    }

    if user.rol in ROLES_ADMIN_COORD:
        datos["lapsoInicio"] = limpiar(lapsoInicio)
        datos["lapsoFin"] = limpiar(lapsoFin)

    if archivo:
        nombre_archivo = f"{uuid.uuid4()}_{archivo.filename}"
        datos["archivo"] = subir_archivo(
            await archivo.read(), nombre_archivo, "planeaciones"
        )
        datos["archivo_original"] = archivo.filename

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
    lapsoInicio: Optional[str] = Form(None),
    lapsoFin: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    user: Entrenador = Depends(get_current_user)
):
    obj = db.query(Planeacion).filter(Planeacion.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="No encontrado")

    if user.rol == "entrenador":
        from app.models.categoria import Categoria
        cat = db.query(Categoria).filter(Categoria.id == obj.idCategoria).first()
        if not cat or cat.idEntrenador != user.id:
            raise HTTPException(status_code=403, detail="No tienes permisos")
        hoy = date.today()
        if not obj.lapsoInicio or not obj.lapsoFin:
            raise HTTPException(status_code=403, detail="No hay un lapso de tiempo definido para subir planeaciones")
        if hoy < obj.lapsoInicio or hoy > obj.lapsoFin:
            raise HTTPException(status_code=403, detail="Fuera del lapso de tiempo permitido para subir planeaciones")

    if nombre: obj.nombre = nombre
    if fechaInicio: obj.fechaInicio = limpiar(fechaInicio)
    if fechaFin: obj.fechaFin = limpiar(fechaFin)
    if fechaCarga: obj.fechaCarga = limpiar(fechaCarga)
    if idCategoria: obj.idCategoria = idCategoria

    if user.rol in ROLES_ADMIN_COORD:
        if lapsoInicio is not None: obj.lapsoInicio = limpiar(lapsoInicio) if lapsoInicio else None
        if lapsoFin is not None: obj.lapsoFin = limpiar(lapsoFin) if lapsoFin else None

    if archivo:
        nombre_archivo = f"{uuid.uuid4()}_{archivo.filename}"
        obj.archivo = subir_archivo(
            await archivo.read(), nombre_archivo, "planeaciones"
        )
        obj.archivo_original = archivo.filename

    db.commit()
    db.refresh(obj)
    return obj

@router.delete("/{id}", status_code=204)
def eliminar(
    id: int,
    db: Session = Depends(get_db),
    user: Entrenador = Depends(get_current_user)
):
    if user.rol not in ROLES_ADMIN_COORD:
        raise HTTPException(status_code=403, detail="No tienes permisos")

    obj = db.query(Planeacion).filter(Planeacion.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="No encontrado")
    db.delete(obj)
    db.commit()
