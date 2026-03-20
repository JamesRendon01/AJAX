from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.jugador import Jugador
from app.services.storage import subir_archivo, limpiar
from typing import Optional
import uuid

router = APIRouter(prefix="/jugadores", tags=["Jugadores"])

@router.get("/")
def listar(db: Session = Depends(get_db)):
    return db.query(Jugador).all()

@router.get("/{id}")
def obtener(id: int, db: Session = Depends(get_db)):
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
    devolucion2: Optional[UploadFile] = File(None),
    devolucion3: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
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
        "idCategoria": idCategoria
    }

    if devolucion1:
        nombre_archivo = f"{uuid.uuid4()}_{devolucion1.filename}"
        datos["devolucion1"] = subir_archivo(
            await devolucion1.read(), nombre_archivo, "jugadores"
        )
    if devolucion2:
        nombre_archivo = f"{uuid.uuid4()}_{devolucion2.filename}"
        datos["devolucion2"] = subir_archivo(
            await devolucion2.read(), nombre_archivo, "jugadores"
        )
    if devolucion3:
        nombre_archivo = f"{uuid.uuid4()}_{devolucion3.filename}"
        datos["devolucion3"] = subir_archivo(
            await devolucion3.read(), nombre_archivo, "jugadores"
        )

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
    devolucion2: Optional[UploadFile] = File(None),
    devolucion3: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
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

    if devolucion1:
        nombre_archivo = f"{uuid.uuid4()}_{devolucion1.filename}"
        obj.devolucion1 = subir_archivo(
            await devolucion1.read(), nombre_archivo, "jugadores"
        )
    if devolucion2:
        nombre_archivo = f"{uuid.uuid4()}_{devolucion2.filename}"
        obj.devolucion2 = subir_archivo(
            await devolucion2.read(), nombre_archivo, "jugadores"
        )
    if devolucion3:
        nombre_archivo = f"{uuid.uuid4()}_{devolucion3.filename}"
        obj.devolucion3 = subir_archivo(
            await devolucion3.read(), nombre_archivo, "jugadores"
        )

    db.commit()
    db.refresh(obj)
    return obj

@router.delete("/{id}", status_code=204)
def eliminar(id: int, db: Session = Depends(get_db)):
    obj = db.query(Jugador).filter(Jugador.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="No encontrado")
    db.delete(obj)
    db.commit()