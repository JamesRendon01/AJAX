from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.jugador import Jugador
from app.models.categoria import Categoria
from app.models.entrenador import Entrenador
from app.services.storage import subir_archivo, limpiar
from app.dependencies import get_current_user, require_rol
from typing import Optional
from datetime import date
import uuid

router = APIRouter(prefix="/jugadores", tags=["Jugadores"])

ROLES_ADMIN_COORD = ("admin", "coordinador")

@router.get("/")
def listar(
    db: Session = Depends(get_db),
    user: Entrenador = Depends(get_current_user)
):
    if user.rol in ROLES_ADMIN_COORD:
        return db.query(Jugador).all()
    else:
        return db.query(Jugador).filter(Jugador.idCategoria.in_(
            db.query(Categoria.id).filter(Categoria.idEntrenador == user.id)
        )).all()

@router.get("/{id}")
def obtener(
    id: int,
    db: Session = Depends(get_db),
    user: Entrenador = Depends(get_current_user)
):
    obj = db.query(Jugador).filter(Jugador.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="No encontrado")
    return obj

@router.post("/", status_code=201)
async def crear(
    nombre: str = Form(...),
    nacionalidad: Optional[str] = Form(None),
    tipoDocumento: Optional[str] = Form(None),
    documento: Optional[str] = Form(None),
    fechaNacimiento: Optional[str] = Form(None),
    edad: Optional[int] = Form(None),
    dorsal: Optional[int] = Form(None),
    contactoEmergencia: Optional[str] = Form(None),
    estado: Optional[str] = Form(None),
    fechaIngreso: Optional[str] = Form(None),
    fechaSalida: Optional[str] = Form(None),
    torneo: Optional[str] = Form(None),
    idCategoria: Optional[int] = Form(None),
    devolucion1: Optional[UploadFile] = File(None),
    devolucion1_fechaInicio: Optional[str] = Form(None),
    devolucion1_fechaFin: Optional[str] = Form(None),
    devolucion2: Optional[UploadFile] = File(None),
    devolucion2_fechaInicio: Optional[str] = Form(None),
    devolucion2_fechaFin: Optional[str] = Form(None),
    devolucion3: Optional[UploadFile] = File(None),
    devolucion3_fechaInicio: Optional[str] = Form(None),
    devolucion3_fechaFin: Optional[str] = Form(None),
    devoluciones: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    user: Entrenador = Depends(get_current_user)
):
    datos = {
        "nombre": nombre,
        "nacionalidad": limpiar(nacionalidad),
        "tipoDocumento": limpiar(tipoDocumento),
        "documento": limpiar(documento),
        "fechaNacimiento": limpiar(fechaNacimiento),
        "edad": edad,
        "dorsal": dorsal,
        "contactoEmergencia": limpiar(contactoEmergencia),
        "estado": limpiar(estado),
        "fechaIngreso": limpiar(fechaIngreso),
        "fechaSalida": limpiar(fechaSalida),
        "torneo": limpiar(torneo),
        "idCategoria": idCategoria,
        "devolucion1_fechaInicio": limpiar(devolucion1_fechaInicio),
        "devolucion1_fechaFin": limpiar(devolucion1_fechaFin),
        "devolucion2_fechaInicio": limpiar(devolucion2_fechaInicio),
        "devolucion2_fechaFin": limpiar(devolucion2_fechaFin),
        "devolucion3_fechaInicio": limpiar(devolucion3_fechaInicio),
        "devolucion3_fechaFin": limpiar(devolucion3_fechaFin),
    }

    if devolucion1:
        nombre_archivo = f"{uuid.uuid4()}_{devolucion1.filename}"
        datos["devolucion1"] = subir_archivo(
            await devolucion1.read(), nombre_archivo, "jugadores"
        )
        datos["devolucion1_original"] = devolucion1.filename
    if devolucion2:
        nombre_archivo = f"{uuid.uuid4()}_{devolucion2.filename}"
        datos["devolucion2"] = subir_archivo(
            await devolucion2.read(), nombre_archivo, "jugadores"
        )
        datos["devolucion2_original"] = devolucion2.filename
    if devolucion3:
        nombre_archivo = f"{uuid.uuid4()}_{devolucion3.filename}"
        datos["devolucion3"] = subir_archivo(
            await devolucion3.read(), nombre_archivo, "jugadores"
        )
        datos["devolucion3_original"] = devolucion3.filename

    if devoluciones:
        if idCategoria:
            cat = db.query(Categoria).filter(Categoria.id == idCategoria).first()
            if cat and cat.lapsoDevolucionesInicio and cat.lapsoDevolucionesFin:
                hoy = date.today()
                if hoy < cat.lapsoDevolucionesInicio or hoy > cat.lapsoDevolucionesFin:
                    raise HTTPException(status_code=403, detail="Fuera del lapso de tiempo permitido para subir devoluciones")
        nombre_archivo = f"{uuid.uuid4()}_{devoluciones.filename}"
        datos["devoluciones"] = subir_archivo(
            await devoluciones.read(), nombre_archivo, "devoluciones"
        )
        datos["devoluciones_original"] = devoluciones.filename

    obj = Jugador(**datos)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

@router.put("/{id}")
async def actualizar(
    id: int,
    nombre: Optional[str] = Form(None),
    nacionalidad: Optional[str] = Form(None),
    tipoDocumento: Optional[str] = Form(None),
    documento: Optional[str] = Form(None),
    fechaNacimiento: Optional[str] = Form(None),
    edad: Optional[int] = Form(None),
    dorsal: Optional[int] = Form(None),
    contactoEmergencia: Optional[str] = Form(None),
    estado: Optional[str] = Form(None),
    fechaIngreso: Optional[str] = Form(None),
    fechaSalida: Optional[str] = Form(None),
    torneo: Optional[str] = Form(None),
    idCategoria: Optional[int] = Form(None),
    devolucion1: Optional[UploadFile] = File(None),
    devolucion1_fechaInicio: Optional[str] = Form(None),
    devolucion1_fechaFin: Optional[str] = Form(None),
    devolucion2: Optional[UploadFile] = File(None),
    devolucion2_fechaInicio: Optional[str] = Form(None),
    devolucion2_fechaFin: Optional[str] = Form(None),
    devolucion3: Optional[UploadFile] = File(None),
    devolucion3_fechaInicio: Optional[str] = Form(None),
    devolucion3_fechaFin: Optional[str] = Form(None),
    devoluciones: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    user: Entrenador = Depends(get_current_user)
):
    obj = db.query(Jugador).filter(Jugador.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="No encontrado")

    if nombre: obj.nombre = nombre
    if nacionalidad: obj.nacionalidad = limpiar(nacionalidad)
    if tipoDocumento: obj.tipoDocumento = limpiar(tipoDocumento)
    if documento: obj.documento = limpiar(documento)
    if fechaNacimiento: obj.fechaNacimiento = limpiar(fechaNacimiento)
    if edad: obj.edad = edad
    if dorsal: obj.dorsal = dorsal
    if contactoEmergencia: obj.contactoEmergencia = limpiar(contactoEmergencia)
    if estado: obj.estado = limpiar(estado)
    if fechaIngreso: obj.fechaIngreso = limpiar(fechaIngreso)
    if fechaSalida: obj.fechaSalida = limpiar(fechaSalida)
    if torneo: obj.torneo = limpiar(torneo)
    if idCategoria: obj.idCategoria = idCategoria
    if devolucion1_fechaInicio: obj.devolucion1_fechaInicio = limpiar(devolucion1_fechaInicio)
    if devolucion1_fechaFin: obj.devolucion1_fechaFin = limpiar(devolucion1_fechaFin)
    if devolucion2_fechaInicio: obj.devolucion2_fechaInicio = limpiar(devolucion2_fechaInicio)
    if devolucion2_fechaFin: obj.devolucion2_fechaFin = limpiar(devolucion2_fechaFin)
    if devolucion3_fechaInicio: obj.devolucion3_fechaInicio = limpiar(devolucion3_fechaInicio)
    if devolucion3_fechaFin: obj.devolucion3_fechaFin = limpiar(devolucion3_fechaFin)

    if devolucion1:
        nombre_archivo = f"{uuid.uuid4()}_{devolucion1.filename}"
        obj.devolucion1 = subir_archivo(
            await devolucion1.read(), nombre_archivo, "jugadores"
        )
        obj.devolucion1_original = devolucion1.filename
    if devolucion2:
        nombre_archivo = f"{uuid.uuid4()}_{devolucion2.filename}"
        obj.devolucion2 = subir_archivo(
            await devolucion2.read(), nombre_archivo, "jugadores"
        )
        obj.devolucion2_original = devolucion2.filename
    if devolucion3:
        nombre_archivo = f"{uuid.uuid4()}_{devolucion3.filename}"
        obj.devolucion3 = subir_archivo(
            await devolucion3.read(), nombre_archivo, "jugadores"
        )
        obj.devolucion3_original = devolucion3.filename

    if devoluciones:
        cat = db.query(Categoria).filter(Categoria.id == obj.idCategoria).first()
        if cat and cat.lapsoDevolucionesInicio and cat.lapsoDevolucionesFin:
            hoy = date.today()
            if hoy < cat.lapsoDevolucionesInicio or hoy > cat.lapsoDevolucionesFin:
                raise HTTPException(status_code=403, detail="Fuera del lapso de tiempo permitido para subir devoluciones")
        nombre_archivo = f"{uuid.uuid4()}_{devoluciones.filename}"
        obj.devoluciones = subir_archivo(
            await devoluciones.read(), nombre_archivo, "devoluciones"
        )
        obj.devoluciones_original = devoluciones.filename

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
    obj = db.query(Jugador).filter(Jugador.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="No encontrado")
    db.delete(obj)
    db.commit()
