from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.entrenador import Entrenador
from app.services.storage import subir_archivo
from typing import Optional
import uuid

router = APIRouter(prefix="/entrenadores", tags=["Entrenadores"])

@router.get("/")
def listar(db: Session = Depends(get_db)):
    return db.query(Entrenador).all()

@router.get("/{id}")
def obtener(id: int, db: Session = Depends(get_db)):
    obj = db.query(Entrenador).filter(Entrenador.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="No encontrado")
    return obj

@router.post("/", status_code=201)
async def crear(
    nombre: str = Form(...),
    tipoDocumento: Optional[str] = Form(None),
    documento: Optional[str] = Form(None),
    celular: Optional[str] = Form(None),
    cargo: Optional[str] = Form(None),
    certificado: Optional[UploadFile] = File(None),
    delitosSexuales: Optional[UploadFile] = File(None),
    tarjetaProfesional: Optional[UploadFile] = File(None),
    certificadoPrimerCorrespondiente: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    datos = {
        "nombre": nombre,
        "tipoDocumento": tipoDocumento,
        "documento": documento,
        "celular": celular,
        "cargo": cargo
    }

    if certificado:
        nombre_archivo = f"{uuid.uuid4()}_{certificado.filename}"
        datos["certificado"] = subir_archivo(
            await certificado.read(), nombre_archivo, "certificados"
        )

    if delitosSexuales:
        nombre_archivo = f"{uuid.uuid4()}_{delitosSexuales.filename}"
        datos["delitosSexuales"] = subir_archivo(
            await delitosSexuales.read(), nombre_archivo, "delitos"
        )

    if tarjetaProfesional:
        nombre_archivo = f"{uuid.uuid4()}_{tarjetaProfesional.filename}"
        datos["tarjetaProfesional"] = subir_archivo(
            await tarjetaProfesional.read(), nombre_archivo, "tarjetas"
        )

    if certificadoPrimerCorrespondiente:
        nombre_archivo = f"{uuid.uuid4()}_{certificadoPrimerCorrespondiente.filename}"
        datos["certificadoPrimerCorrespondiente"] = subir_archivo(
            await certificadoPrimerCorrespondiente.read(), nombre_archivo, "primeros_auxilios"
        )

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
    celular: Optional[str] = Form(None),
    cargo: Optional[str] = Form(None),
    certificado: Optional[UploadFile] = File(None),
    delitosSexuales: Optional[UploadFile] = File(None),
    tarjetaProfesional: Optional[UploadFile] = File(None),
    certificadoPrimerCorrespondiente: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    obj = db.query(Entrenador).filter(Entrenador.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="No encontrado")

    if nombre: obj.nombre = nombre
    if tipoDocumento: obj.tipoDocumento = tipoDocumento
    if documento: obj.documento = documento
    if celular: obj.celular = celular
    if cargo: obj.cargo = cargo

    if certificado:
        nombre_archivo = f"{uuid.uuid4()}_{certificado.filename}"
        obj.certificado = subir_archivo(
            await certificado.read(), nombre_archivo, "certificados"
        )
    if delitosSexuales:
        nombre_archivo = f"{uuid.uuid4()}_{delitosSexuales.filename}"
        obj.delitosSexuales = subir_archivo(
            await delitosSexuales.read(), nombre_archivo, "delitos"
        )
    if tarjetaProfesional:
        nombre_archivo = f"{uuid.uuid4()}_{tarjetaProfesional.filename}"
        obj.tarjetaProfesional = subir_archivo(
            await tarjetaProfesional.read(), nombre_archivo, "tarjetas"
        )
    if certificadoPrimerCorrespondiente:
        nombre_archivo = f"{uuid.uuid4()}_{certificadoPrimerCorrespondiente.filename}"
        obj.certificadoPrimerCorrespondiente = subir_archivo(
            await certificadoPrimerCorrespondiente.read(), nombre_archivo, "primeros_auxilios"
        )

    db.commit()
    db.refresh(obj)
    return obj

@router.delete("/{id}", status_code=204)
def eliminar(id: int, db: Session = Depends(get_db)):
    obj = db.query(Entrenador).filter(Entrenador.id == id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="No encontrado")
    db.delete(obj)
    db.commit()