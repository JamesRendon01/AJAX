from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.entrenador import Entrenador
from app.services.storage import subir_archivo
from app.dependencies import get_current_user, require_rol
from typing import Optional
import uuid

router = APIRouter(prefix="/entrenadores", tags=["Entrenadores"])

ADMIN = Depends(require_rol("admin"))
AUTH = Depends(get_current_user)

@router.get("/")
def listar(db: Session = Depends(get_db), user: Entrenador = AUTH):
    return db.query(Entrenador).all()

@router.get("/{id}")
def obtener(id: int, db: Session = Depends(get_db), user: Entrenador = AUTH):
    obj = db.query(Entrenador).filter(Entrenador.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="No encontrado")
    return obj

@router.post("/", status_code=201)
async def crear(
    nombre: str = Form(...),
    tipoDocumento: Optional[str] = Form(None),
    documento: Optional[str] = Form(None),
    password: Optional[str] = Form("1234"),
    rol: Optional[str] = Form("entrenador"),
    celular: Optional[str] = Form(None),
    cargo: Optional[str] = Form(None),
    email: Optional[str] = Form(None),
    coced: Optional[str] = Form(None),
    contactoEmergencia: Optional[str] = Form(None),
    fechaInicio: Optional[str] = Form(None),
    fechaFin: Optional[str] = Form(None),
    certificado: Optional[UploadFile] = File(None),
    delitosSexuales: Optional[UploadFile] = File(None),
    tarjetaProfesional: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    admin: Entrenador = ADMIN
):
    datos = {
        "nombre": nombre,
        "tipoDocumento": tipoDocumento,
        "documento": documento,
        "password": password,
        "rol": rol,
        "celular": celular,
        "cargo": cargo,
        "email": email,
        "coced": coced,
        "contactoEmergencia": contactoEmergencia,
        "fechaInicio": fechaInicio,
        "fechaFin": fechaFin
    }

    if certificado:
        nombre_archivo = f"{uuid.uuid4()}_{certificado.filename}"
        datos["certificado"] = subir_archivo(
            await certificado.read(), nombre_archivo, "certificados"
        )
        datos["certificado_original"] = certificado.filename

    if delitosSexuales:
        nombre_archivo = f"{uuid.uuid4()}_{delitosSexuales.filename}"
        datos["delitosSexuales"] = subir_archivo(
            await delitosSexuales.read(), nombre_archivo, "delitos"
        )
        datos["delitosSexuales_original"] = delitosSexuales.filename

    if tarjetaProfesional:
        nombre_archivo = f"{uuid.uuid4()}_{tarjetaProfesional.filename}"
        datos["tarjetaProfesional"] = subir_archivo(
            await tarjetaProfesional.read(), nombre_archivo, "tarjetas"
        )
        datos["tarjetaProfesional_original"] = tarjetaProfesional.filename

    obj = Entrenador(**datos)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

@router.put("/{id}")
async def actualizar(
    id: int,
    nombre: Optional[str] = Form(None),
    tipoDocumento: Optional[str] = Form(None),
    documento: Optional[str] = Form(None),
    password: Optional[str] = Form(None),
    rol: Optional[str] = Form(None),
    celular: Optional[str] = Form(None),
    cargo: Optional[str] = Form(None),
    email: Optional[str] = Form(None),
    coced: Optional[str] = Form(None),
    contactoEmergencia: Optional[str] = Form(None),
    fechaInicio: Optional[str] = Form(None),
    fechaFin: Optional[str] = Form(None),
    certificado: Optional[UploadFile] = File(None),
    delitosSexuales: Optional[UploadFile] = File(None),
    tarjetaProfesional: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    admin: Entrenador = ADMIN
):
    obj = db.query(Entrenador).filter(Entrenador.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="No encontrado")

    if nombre: obj.nombre = nombre
    if tipoDocumento: obj.tipoDocumento = tipoDocumento
    if documento: obj.documento = documento
    if password: obj.password = password
    if rol: obj.rol = rol
    if celular: obj.celular = celular
    if cargo: obj.cargo = cargo
    if email: obj.email = email
    if coced: obj.coced = coced
    if contactoEmergencia: obj.contactoEmergencia = contactoEmergencia
    if fechaInicio: obj.fechaInicio = fechaInicio
    if fechaFin: obj.fechaFin = fechaFin

    if certificado:
        nombre_archivo = f"{uuid.uuid4()}_{certificado.filename}"
        obj.certificado = subir_archivo(
            await certificado.read(), nombre_archivo, "certificados"
        )
        obj.certificado_original = certificado.filename
    if delitosSexuales:
        nombre_archivo = f"{uuid.uuid4()}_{delitosSexuales.filename}"
        obj.delitosSexuales = subir_archivo(
            await delitosSexuales.read(), nombre_archivo, "delitos"
        )
        obj.delitosSexuales_original = delitosSexuales.filename
    if tarjetaProfesional:
        nombre_archivo = f"{uuid.uuid4()}_{tarjetaProfesional.filename}"
        obj.tarjetaProfesional = subir_archivo(
            await tarjetaProfesional.read(), nombre_archivo, "tarjetas"
        )
        obj.tarjetaProfesional_original = tarjetaProfesional.filename

    db.commit()
    db.refresh(obj)
    return obj

@router.delete("/{id}", status_code=204)
def eliminar(id: int, db: Session = Depends(get_db), admin: Entrenador = ADMIN):
    obj = db.query(Entrenador).filter(Entrenador.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="No encontrado")
    db.delete(obj)
    db.commit()