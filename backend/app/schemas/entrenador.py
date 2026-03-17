# app/schemas/entrenador.py
from pydantic import BaseModel
from typing import Optional

class EntrenadorCreate(BaseModel):
    nombre: str
    tipoDocumento: Optional[str] = None
    documento: Optional[str] = None
    certificado: Optional[str] = None
    delitosSexuales: Optional[str] = None
    tarjetaProfesional: Optional[str] = None
    certificadoPrimerCorrespondiente: Optional[str] = None
    celular: Optional[str] = None
    cargo: Optional[str] = None

class EntrenadorUpdate(BaseModel):
    nombre: Optional[str] = None
    tipoDocumento: Optional[str] = None
    documento: Optional[str] = None
    certificado: Optional[str] = None
    delitosSexuales: Optional[str] = None
    tarjetaProfesional: Optional[str] = None
    certificadoPrimerCorrespondiente: Optional[str] = None
    celular: Optional[str] = None
    cargo: Optional[str] = None

class EntrenadorResponse(BaseModel):
    id: int
    nombre: Optional[str]
    tipoDocumento: Optional[str]
    documento: Optional[str]
    certificado: Optional[str]
    delitosSexuales: Optional[str]
    tarjetaProfesional: Optional[str]
    certificadoPrimerCorrespondiente: Optional[str]
    celular: Optional[str]
    cargo: Optional[str]

    class Config:
        from_attributes = True