from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.jugador import Jugador
from app.services.storage import subir_archivo
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
    archivo: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    datos = {
        "nombre": nombre,
        "nacionalidad": nacionalidad,
        "tipoDocumento": tipoDocumento,
        "documento": documento,
        "fechaNacimiento": fechaNacimiento,
        "edad": edad,
        "dorsal": dorsal,
        "contactoEmergencia": contactoEmergencia,
        "estado": estado,
        "fechaIngreso": fechaIngreso,
        "fechaSalida": fechaSalida,
        "torneo": torneo,
        "idCategoria": idCategoria
    }

    if archivo:
        nombre_archivo = f"{uuid.uuid4()}_{archivo.filename}"
        datos["devolucion1"] = subir_archivo(
            await archivo.read(), nombre_archivo, "jugadores"
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
    archivo: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    obj = db.query(Jugador).filter(Jugador.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="No encontrado")

    if nombre: obj.nombre = nombre
    if nacionalidad: obj.nacionalidad = nacionalidad
    if tipoDocumento: obj.tipoDocumento = tipoDocumento
    if documento: obj.documento = documento
    if fechaNacimiento: obj.fechaNacimiento = fechaNacimiento
    if edad: obj.edad = edad
    if dorsal: obj.dorsal = dorsal
    if contactoEmergencia: obj.contactoEmergencia = contactoEmergencia
    if estado: obj.estado = estado
    if fechaIngreso: obj.fechaIngreso = fechaIngreso
    if fechaSalida: obj.fechaSalida = fechaSalida
    if torneo: obj.torneo = torneo
    if idCategoria: obj.idCategoria = idCategoria

    if archivo:
        nombre_archivo = f"{uuid.uuid4()}_{archivo.filename}"
        obj.devolucion1 = subir_archivo(
            await archivo.read(), nombre_archivo, "jugadores"
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